using AutoMapper;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;

namespace BookstoreWebAPI.Repository
{
    public class SupplierGroupRepository : ISupplierGroupRepository
    {
        private readonly string supplierGroupNewIdCacheName = "LastestSupplierGroupId";

        private readonly ILogger<SupplierGroupRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IActivityLogRepository _activityLogRepository;
        private Container _supplierGroupContainer;

        public SupplierGroupRepository(
            CosmosClient cosmosClient,
            ILogger<SupplierGroupRepository> logger,
            IMapper mapper,
            IMemoryCache memoryCache,
            IActivityLogRepository activityLogRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _memoryCache = memoryCache;
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "supplierGroups";

            _supplierGroupContainer = cosmosClient.GetContainer(databaseName, containerName);
            _activityLogRepository = activityLogRepository;
        }

        public async Task<int> GetTotalCount()
        {
            var countQueryDef = new QueryDefinition(
                query:
                    "SELECT VALUE COUNT(1) " +
                    "FROM c " +
                    "WHERE c.isDeleted = false"
            );

            var count = await CosmosDbUtils.GetScalarValueByQueryDefinition<int>(_supplierGroupContainer, countQueryDef);

            return count;
        }

        public async Task<IEnumerable<SupplierGroupDTO>> GetSupplierGroupDTOsAsync(QueryParameters queryParams)
        {
            var queryDef = CosmosDbUtils.BuildQuery<SupplierGroupDocument>(queryParams);

            var supplierGroupDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<SupplierGroupDocument>(_supplierGroupContainer, queryDef);
            var supplierGroupDTOs = supplierGroupDocs.Select(supplierGroupDoc =>
            {
                return _mapper.Map<SupplierGroupDTO>(supplierGroupDoc);
            }).ToList();

            return supplierGroupDTOs;
        }

        public async Task<SupplierGroupDTO?> GetSupplierGroupDTOByIdAsync(string id)
        {
            var supplierGroupDoc = await GetSupplierGroupDocumentByIdAsync(id);

            var supplierGroupDTO = _mapper.Map<SupplierGroupDTO>(supplierGroupDoc);

            return supplierGroupDTO;
        }

        public async Task<SupplierGroupDTO> AddSupplierGroupDTOAsync(SupplierGroupDTO supplierGroupDTO)
        {
            if (await NameExistsInContainer(supplierGroupDTO.Name))
            {
                throw new DuplicateDocumentException($"The supplierGroup {supplierGroupDTO.Name} has already been created. Please choose a different name.");
            }

            var supplierGroupDoc = _mapper.Map<SupplierGroupDocument>(supplierGroupDTO);
            await PopulateDataToNewSupplierGroupDocument(supplierGroupDoc);

            var createdDocument = await AddSupplierGroupDocumentAsync(supplierGroupDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(supplierGroupNewIdCacheName, IdUtils.IncreaseId(supplierGroupDoc.Id));

                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    supplierGroupDoc.StaffId,
                    "Nhóm nhà cung cấp",
                    supplierGroupDoc.SupplierGroupId
                );

                return _mapper.Map<SupplierGroupDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }
        public async Task UpdateSupplierGroupDTOAsync(SupplierGroupDTO item)
        {
            var supplierGroupToUpdate = _mapper.Map<SupplierGroupDocument>(item);
            supplierGroupToUpdate.ModifiedAt = DateTime.UtcNow;

            await _supplierGroupContainer.UpsertItemAsync(
                item: supplierGroupToUpdate,
                partitionKey: new PartitionKey(supplierGroupToUpdate.SupplierGroupId)
            );

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.update,
                supplierGroupToUpdate.StaffId,
                "Nhóm nhà cung cấp",
                supplierGroupToUpdate.SupplierGroupId
            );

            // Change feed to update products
        }
        public async Task<BatchDeletionResult<SupplierGroupDTO>> DeleteSupplierGroupsAsync(string[] ids)
        {
            BatchDeletionResult<SupplierGroupDTO> result = new()
            {
                Responses = new(),
                IsNotSuccessful = true,
                IsNotForbidden = true,
                IsFound = true
            };

            int currOrder = 0;

            foreach (var id in ids)
            {
                currOrder++;
                var supplierGroupDoc = await GetSupplierGroupDocumentByIdAsync(id);
                var supplierGroupDTO = _mapper.Map<SupplierGroupDTO>(supplierGroupDoc);

                // Handle case where supplierDoc is null
                if (supplierGroupDoc == null)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: supplierGroupDTO,
                        statusCode: 404
                    );
                    continue;
                }

                // Handle case where supplierDoc is not removable
                if (!supplierGroupDoc.IsRemovable)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: supplierGroupDTO,
                        statusCode: 403
                    );
                    continue;
                }

                // Delete the supplier
                await DeleteSupplierGroup(supplierGroupDoc, id);
                CosmosDbUtils.AddResponse(
                    batchDeletionResult: result,
                    responseOrder: currOrder,
                    responseData: supplierGroupDTO,
                    statusCode: 204
                );

                _logger.LogInformation($"Deleted supplierGroup with id: {id}");
            }

            return result;
        }


        private async Task<SupplierGroupDocument?> GetSupplierGroupDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.id = @id AND c.isDeleted = false"
            ).WithParameter("@id", id);

            var supplierGroup = await CosmosDbUtils.GetDocumentByQueryDefinition<SupplierGroupDocument>(_supplierGroupContainer, queryDef);

            return supplierGroup;
        }

        private async Task DeleteSupplierGroup(SupplierGroupDocument supplierGroupDoc, string id)
        {
            List<PatchOperation> patchOperations = new()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _supplierGroupContainer.PatchItemAsync<SupplierGroupDocument>(id, new PartitionKey(supplierGroupDoc.SupplierGroupId), patchOperations);

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.delete,
                supplierGroupDoc.StaffId,
                "Nhóm nhà cung cấp",
                supplierGroupDoc.SupplierGroupId
            );

        }

        private async Task<string> GetNewSupplierGroupIdAsync()
        {
            if (_memoryCache.TryGetValue(supplierGroupNewIdCacheName, out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query:
                "SELECT TOP 1 c.id " +
                "FROM c " +
                "ORDER BY c.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_supplierGroupContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(supplierGroupNewIdCacheName, newId);
            return newId;
        }
        private async Task<bool> NameExistsInContainer(string supplierGroupName)
        {
            var queryDef = new QueryDefinition(
                "SELECT * " +
                "FROM c " +
                "WHERE c.isDeleted = false AND STRINGEQUALS(@supplierGroupName,c.name,true)"
            ).WithParameter("@supplierGroupName", supplierGroupName);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<SupplierGroupDocument>(_supplierGroupContainer, queryDef);

            return result != null;
        }
        private async Task PopulateDataToNewSupplierGroupDocument(SupplierGroupDocument supplierGroupDoc)
        {
            supplierGroupDoc.Id = await GetNewSupplierGroupIdAsync();
            supplierGroupDoc.SupplierGroupId = supplierGroupDoc.Id;
            //supplierGroupDoc.IsRemovable = true;
            //supplierGroupDoc.IsDeleted = false;
        }

        //private async Task DeleteSupplierGroupAsync(string supplierGroupId)
        //{
        //    var supplierGroupDoc = await GetSupplierGroupDocumentByIdAsync(supplierGroupId) ?? throw new DocumentNotFoundException($"SupplierGroup with id {supplierGroupId} not found.");

        //    if (!supplierGroupDoc.IsRemovable)
        //    {
        //        throw new DocumentRemovalException("This supplierGroup is not removable.");
        //    }

        //    List<PatchOperation> patchOperations = new()
        //    {
        //        PatchOperation.Replace("/isDeleted", true)
        //    };

        //    await _supplierGroupContainer.PatchItemAsync<SupplierGroupDocument>(supplierGroupId, new PartitionKey(supplierGroupDoc.SupplierGroupId), patchOperations);
        //}


        // for data seeder, private after production
        private async Task<ItemResponse<SupplierGroupDocument>> AddSupplierGroupDocumentAsync(SupplierGroupDocument item)
        {
            try
            {
                item.CreatedAt = DateTime.UtcNow;
                item.ModifiedAt = item.CreatedAt;

                var response = await _supplierGroupContainer.UpsertItemAsync(
                    item: item,
                    partitionKey: new PartitionKey(item.SupplierGroupId)
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
