using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Shared;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Services;
using BookstoreWebAPI.Utils;
using Azure.Search.Documents.Models;

namespace BookstoreWebAPI.Repository
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly string supplierNewIdCacheName = "LastestSupplierId";

        private readonly ILogger<SupplierRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly Container _supplierContainer;
        private readonly Container _supplierGroupContainer;
        private readonly AzureSearchClientService _searchService;
        private readonly IndexDocumentsBatch<SearchDocument> _supplierBatch;

        private SupplierGroupDocument? _defaultSupplierGroup;

        public int TotalCount {  get; private set; }

        public SupplierRepository(
            ILogger<SupplierRepository> logger,
            IMapper mapper,
            IMemoryCache memoryCache,
            IActivityLogRepository activityLogRepository,
            CosmosClient cosmosClient,
            AzureSearchServiceFactory searchServiceFactory
        )
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "suppliers";
            _supplierContainer = cosmosClient.GetContainer(databaseName, containerName);
            _supplierGroupContainer = cosmosClient.GetContainer(databaseName, "supplierGroups");

            _searchService = searchServiceFactory.Create(containerName);
            _logger = logger;
            _mapper = mapper;
            _memoryCache = memoryCache;
            _activityLogRepository = activityLogRepository;
            _supplierBatch = new();
        }

        public async Task<IEnumerable<SupplierDTO>> GetSupplierDTOsAsync(QueryParameters queryParams, SupplierFilterModel filter)
        {
            IEnumerable<SupplierDocument> supplierDocs = [];

            if (filter.Query == null)
            {
                var queryDef = CosmosDbUtils.BuildQuery(queryParams, filter);
                supplierDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<SupplierDocument>(_supplierContainer, queryDef);
                TotalCount = supplierDocs == null ? 0 : supplierDocs.Count();

                if (queryParams.PageSize != -1)
                {
                    queryParams.PageSize = -1;
                    var queryDefGetAll = CosmosDbUtils.BuildQuery(queryParams, filter);
                    var allSupplierDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<SupplierDocument>(_supplierContainer, queryDefGetAll);
                    TotalCount = allSupplierDocs == null ? 0 : allSupplierDocs.Count();
                }
            }
            else
            {
                var options = AzureSearchUtils.BuildOptions(queryParams, filter);
                var searchResult = await _searchService.SearchAsync<SupplierDocument>(filter.Query, options);
                TotalCount = searchResult.TotalCount;
                supplierDocs = searchResult.Results;
            }

            var supplierDTOs = supplierDocs.Select(supplierDoc =>
            {
                return _mapper.Map<SupplierDTO>(supplierDoc);
            }).ToList();

            return supplierDTOs;
        }

        public async Task<SupplierDTO?> GetSupplierDTOByIdAsync(string id)
        {
            var supplierDoc = await GetSupplierDocumentByIdAsync(id);
            
            if (supplierDoc == null)
            {
                return null;
            }


            var supplierDTO = _mapper.Map<SupplierDTO>(supplierDoc);

            return supplierDTO;
        }


        public async Task<SupplierDTO> AddSupplierDTOAsync(SupplierDTO supplierDTO)
        {
            // add some validation to duplicated supplier

            var supplierDoc = _mapper.Map<SupplierDocument>(supplierDTO);
            await PopulateDataToNewSupplierDocument(supplierDoc);


            var createdDocument = await AddSupplierDocumentAsync(supplierDoc);

            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(supplierNewIdCacheName, IdUtils.IncreaseId(supplierDoc.Id));

                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    supplierDoc.StaffId,
                    "Nhà cung cấp",
                    supplierDoc.SupplierId
                );

                _searchService.InsertToBatch(_supplierBatch, createdDocument.Resource, BatchAction.Upload);
                await _searchService.ExecuteBatchIndex(_supplierBatch);

                _logger.LogInformation($"[SupplierRepository] Uploaded new supplier {createdDocument.Resource.Id} to index");


                return _mapper.Map<SupplierDTO>(createdDocument.Resource);
            }

            throw new Exception($"Failed to create supplier with id: {supplierDoc.Id}");
        }

        public async Task UpdateSupplierDTOAsync(SupplierDTO supplierDTO)
        {
            var supplierToUpdate = _mapper.Map<SupplierDocument>(supplierDTO);
            supplierToUpdate.ModifiedAt = DateTime.UtcNow;

            await _supplierContainer.UpsertItemAsync(
                item: supplierToUpdate,
                partitionKey: new PartitionKey(supplierToUpdate.SupplierId)
            );

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.update,
                supplierToUpdate.StaffId,
                "Nhà cung cấp",
                supplierToUpdate.SupplierId
            );

            _searchService.InsertToBatch(_supplierBatch, supplierToUpdate, BatchAction.Merge);
            await _searchService.ExecuteBatchIndex(_supplierBatch);

            _logger.LogInformation($"[SupplierRepository] Merged uploaded supplier {supplierToUpdate.Id} to index");

            // change feed to update products
        }

        public async Task<BatchDeletionResult<SupplierDTO>> DeleteSuppliersAsync(string[] ids)
        {
            BatchDeletionResult<SupplierDTO> result = new()
            {
                Responses = [],
                IsNotSuccessful = true,
                IsNotForbidden = true,
                IsFound = true
            };

            int currOrder = 0;

            foreach (var id in ids)
            {
                currOrder++;
                var supplierDoc = await GetSupplierDocumentByIdAsync(id);
                var supplierDTO = _mapper.Map<SupplierDTO>(supplierDoc);

                // Handle case where supplierDoc is null
                if (supplierDoc == null)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: supplierDTO,
                        statusCode: 404
                    );

                    continue;
                }

                // Handle case where supplierDoc is not removable
                if (!supplierDoc.IsRemovable)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: supplierDTO,
                        statusCode: 403
                    );
                    continue;
                }

                // Delete the supplier
                await DeleteSupplier(supplierDoc, id);
                CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: supplierDTO,
                        statusCode: 204
                    );
                _searchService.InsertToBatch(_supplierBatch, supplierDoc, BatchAction.Merge);

                _logger.LogInformation($"Deleted supplier with id: {id}");
            }

            await _searchService.ExecuteBatchIndex(_supplierBatch);

            _logger.LogInformation($"[SupplierRepository] Merged deleted categories into index, count: {_supplierBatch.Actions.Count}");

            return result;
        }

        private async Task<SupplierDocument?> GetSupplierDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po " +
                    "WHERE po.id = @id"
            ).WithParameter("@id", id);

            var supplier = await CosmosDbUtils.GetDocumentByQueryDefinition<SupplierDocument>(_supplierContainer, queryDef);

            return supplier;
        }

        private async Task DeleteSupplier(SupplierDocument supplierDoc, string id)
        {
            supplierDoc.IsDeleted = true;
            List<PatchOperation> patchOperations = new()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _supplierGroupContainer.PatchItemAsync<SupplierDocument>(id, new PartitionKey(supplierDoc.SupplierId), patchOperations);

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.delete,
                supplierDoc.StaffId,
                "Nhà cung cấp",
                supplierDoc.SupplierId
            );
        }

        private async Task PopulateDataToNewSupplierDocument(SupplierDocument supplierDoc)
        {
            _defaultSupplierGroup ??= await GetDefaultSupplierGroupDocument();
            var defaultContact = new Contact() { Email = string.Empty, Phone = string.Empty };
            var defaultStringValue = string.Empty;

            supplierDoc.Id = await GetNewSupplierIdAsync();
            supplierDoc.SupplierId = supplierDoc.Id;
            supplierDoc.SupplierGroupId ??= _defaultSupplierGroup.Id;
            supplierDoc.SupplierGroupName ??= _defaultSupplierGroup.Name;
            supplierDoc.Contact ??= defaultContact;
            supplierDoc.Address ??= defaultStringValue;
            supplierDoc.Description ??= defaultStringValue;
            supplierDoc.IsActive = true;
            supplierDoc.IsRemovable = true;
            supplierDoc.IsDeleted = false;
        }

        private async Task<string> GetNewSupplierIdAsync()
        {
            if (_memoryCache.TryGetValue(supplierNewIdCacheName, out string? lastestId))
            {
                if (!string.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query:
                "SELECT TOP 1 po.id " +
                "FROM po " +
                "ORDER BY po.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_supplierContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(supplierNewIdCacheName, newId);
            return newId;
        }

        public async Task<SupplierGroupDocument> GetDefaultSupplierGroupDocument()
        {
            var getDefaultSupGroupQueryDef = new QueryDefinition(
                query:
                "SELECT * " +
                "FROM c " +
                "WHERE c.id = @id"
            ).WithParameter("@id", "supg00000");

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<SupplierGroupDocument>(_supplierGroupContainer, getDefaultSupGroupQueryDef)
                ?? throw new Exception("Default SupplierGroup Not Found!");

            return result;
        }

        private async Task<ItemResponse<SupplierDocument>> AddSupplierDocumentAsync(SupplierDocument item)
        {
            try
            {
                item.CreatedAt = DateTime.UtcNow;
                item.ModifiedAt = item.CreatedAt;

                var response = await _supplierContainer.UpsertItemAsync(
                    item: item,
                    partitionKey: new PartitionKey(item.SupplierId)
                );

                return response;
            }
            catch (CosmosException)
            {
                // unhandled
                throw;
            }
        }
    }
}
