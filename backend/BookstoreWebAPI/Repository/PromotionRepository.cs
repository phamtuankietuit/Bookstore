using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Services;

namespace BookstoreWebAPI.Repository
{
    public class PromotionRepository : IPromotionRepository
    {
        private readonly string promotionNewIdCacheName = "LastestPromotionId";

        private Container _promotionContainer;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IActivityLogRepository _activityLogRepository;
        private ILogger<PromotionRepository> _logger;
        private readonly AzureSearchService _searchService;

        public int TotalCount { get; private set; }

        public PromotionRepository(
            CosmosClient cosmosClient,
            IMapper mapper,
            IMemoryCache memoryCache,
            ILogger<PromotionRepository> logger,
            IActivityLogRepository activityLogRepository,
            AzureSearchServiceFactory searchServiceFactory)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "promotions";

            _promotionContainer = cosmosClient.GetContainer(databaseName, containerName);
            _searchService = searchServiceFactory.Create(containerName);

            _mapper = mapper;
            _memoryCache = memoryCache;
            _logger = logger;
            _activityLogRepository = activityLogRepository;
        }

        public async Task<int> GetTotalCount(QueryParameters queryParams, PromotionFilterModel filter)
        {
            var tempQueryParams = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = -1
            };

            tempQueryParams.PageSize = -1;

            var queryDef = CosmosDbUtils.BuildQuery<PromotionDocument>(tempQueryParams, filter);

            var promotionDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<PromotionDocument>(_promotionContainer, queryDef);

            var count = promotionDocs.Count();

            return count;
        }

        public async Task<IEnumerable<PromotionDTO>> GetPromotionDTOsAsync(QueryParameters queryParams, PromotionFilterModel filter)
        {
            filter.Query ??= "*";
            var options = AzureSearchUtils.BuildOptions(queryParams, filter);
            var searchResult = await _searchService.SearchAsync<PromotionDocument>(filter.Query, options);
            TotalCount = searchResult.TotalCount;
            var promotionDocs = searchResult.Results; 
            var promotionDTOs = promotionDocs.Select(promotionDoc =>
            {
                return _mapper.Map<PromotionDTO>(promotionDoc);
            }).ToList();

            return promotionDTOs;
        }

        public async Task<PromotionDTO?> GetPromotionDTOByIdAsync(string id)
        {
            var promotionDoc = await GetPromotionDocumentByIdAsync(id);

            var promotionDTO = _mapper.Map<PromotionDTO>(promotionDoc);

            return promotionDTO;
        }

        public async Task<PromotionDTO> AddPromotionDTOAsync(PromotionDTO promotionDTO)
        {
            // validation for uniqueness

            var promotionDoc = _mapper.Map<PromotionDocument>(promotionDTO);
            await PopulateDataToNewPromotionDocument(promotionDoc);

            var createdDocument = await AddPromotionDocumentAsync(promotionDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(promotionNewIdCacheName, IdUtils.IncreaseId(promotionDoc.Id));
                
                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    promotionDoc.StaffId,
                    "Mã giảm giá",
                    promotionDoc.PromotionId
                );

                return _mapper.Map<PromotionDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }

        public async Task UpdatePromotionDTOAsync(PromotionDTO promotionDTO)
        {
            var promotionToUpdate = _mapper.Map<PromotionDocument>(promotionDTO);
            promotionToUpdate.ModifiedAt = DateTime.UtcNow;

            await _promotionContainer.UpsertItemAsync(
                item: promotionToUpdate,
                partitionKey: new PartitionKey(promotionToUpdate.PromotionId)
            );

            await _activityLogRepository.LogActivity(
                    Enums.ActivityType.update,
                    promotionToUpdate.StaffId,
                    "Mã giảm giá",
                    promotionToUpdate.PromotionId
                );
        }

        public async Task<BatchDeletionResult<PromotionDTO>> DeletePromotionDTOsAsync(string[] ids)
        {
            BatchDeletionResult<PromotionDTO> result = new()
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
                var promotionDoc = await GetPromotionDocumentByIdAsync(id);
                var promotionDTO = _mapper.Map<PromotionDTO>(promotionDoc);

                // Handle case where supplierDoc is null
                if (promotionDoc == null)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: promotionDTO,
                        statusCode: 404
                    );
                    continue;
                }

                // Handle case where supplierDoc is not removable
                if (!promotionDoc.IsRemovable)
                {
                    CosmosDbUtils.AddResponse(
                        batchDeletionResult: result,
                        responseOrder: currOrder,
                        responseData: promotionDTO,
                        statusCode: 403
                    );
                    continue;
                }

                // Delete the supplier
                await DeletePromotion(promotionDoc);
                CosmosDbUtils.AddResponse(
                    batchDeletionResult: result,
                    responseOrder: currOrder,
                    responseData: promotionDTO,
                    statusCode: 204
                );

                _logger.LogInformation($"Deleted promotion with id: {id}");
            }

            return result;

            // code to update the product in background using function
        }

        private async Task DeletePromotion(PromotionDocument promotionDoc)
        {
            List<PatchOperation> patchOperations = new()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _promotionContainer.PatchItemAsync<PromotionDocument>(promotionDoc.Id, new PartitionKey(promotionDoc.PromotionId), patchOperations);

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.delete,
                promotionDoc.StaffId,
                "Mã giảm giá",
                promotionDoc.PromotionId
            );
        }


        private async Task PopulateDataToNewPromotionDocument(PromotionDocument promotionDoc)
        {
            var defaultPromotionType = new
            {
                Type = "on_order_total_amount",
                TypeName = "Chiết khấu theo tổng giá trị đơn hàng"
            };

            promotionDoc.Id = await GetNewPromotionIdAsync();
            promotionDoc.PromotionId = promotionDoc.Id;
            promotionDoc.Type ??= defaultPromotionType.Type;
            promotionDoc.TypeName ??= defaultPromotionType.TypeName;
        }



        private async Task<ItemResponse<PromotionDocument>> AddPromotionDocumentAsync(PromotionDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.ModifiedAt = item.CreatedAt;

            return await _promotionContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.PromotionId)
            );
        }

        
        

        

        public async Task<string> GetNewPromotionIdAsync()
        {
            if (_memoryCache.TryGetValue(promotionNewIdCacheName, out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query:
                "SELECT TOP 1 po.id " +
                "FROM po " +
                "ORDER BY po.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_promotionContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(promotionNewIdCacheName, newId);
            return newId;
        }

        private async Task<PromotionDocument?> GetPromotionDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po " +
                    "WHERE po.id = @id"
            ).WithParameter("@id", id);

            var promotion = await CosmosDbUtils.GetDocumentByQueryDefinition<PromotionDocument>(_promotionContainer, queryDef);

            return promotion;

        }
    }
}
