using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Services;
using Azure.Search.Documents.Models;

namespace BookstoreWebAPI.Repository
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly string purchaseOrderNewIdCacheName = "LastestPurchaseOrderId";
        private readonly ILogger<PurchaseOrderRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IActivityLogRepository _activityLogRepository;
        private Container _purchaseOrderContainer;
        private readonly AzureSearchClientService _searchService;
        private readonly IndexDocumentsBatch<SearchDocument> _purchaseOrderBatch;

        public int TotalCount { get; private set; }

        public PurchaseOrderRepository(
            CosmosClient cosmosClient,
            ILogger<PurchaseOrderRepository> logger,
            IMapper mapper,
            IMemoryCache memoryCache,
            IActivityLogRepository activityLogRepository,
            AzureSearchServiceFactory searchServiceFactory)
        {
            _logger = logger;
            _mapper = mapper;
            _memoryCache = memoryCache;

            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "purchaseOrders";

            _purchaseOrderContainer = cosmosClient.GetContainer(databaseName, containerName);
            _searchService = searchServiceFactory.Create(containerName);
            _activityLogRepository = activityLogRepository;
            _purchaseOrderBatch = new();
        }

        public async Task<IEnumerable<PurchaseOrderDTO>> GetPurchaseOrderDTOsAsync(QueryParameters queryParams, PurchaseOrderFilterModel filter)
        {
            IEnumerable<PurchaseOrderDocument?> purchaseOrderDocs = [];

            if (filter.Query == null)
            {
                var queryDef = CosmosDbUtils.BuildQuery(queryParams, filter);
                purchaseOrderDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<PurchaseOrderDocument>(_purchaseOrderContainer, queryDef);
                TotalCount = purchaseOrderDocs == null ? 0 : purchaseOrderDocs.Count();

                if (queryParams.PageSize != -1)
                {
                    queryParams.PageSize = -1;
                    var queryDefGetAll = CosmosDbUtils.BuildQuery(queryParams, filter);
                    var allPurchaseOrderDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<PurchaseOrderDocument>(_purchaseOrderContainer, queryDefGetAll);
                    TotalCount = allPurchaseOrderDocs == null ? 0 : allPurchaseOrderDocs.Count();
                }
            }
            else
            {
                var options = AzureSearchUtils.BuildOptions(queryParams, filter);
                var searchResult = await _searchService.SearchAsync<PurchaseOrderDocument>(filter.Query, options);
                TotalCount = searchResult.TotalCount;
                purchaseOrderDocs = searchResult.Results;
            }
            var purchaseOrderDTOs = purchaseOrderDocs.Select(purchaseOrderDoc =>
            {
                return _mapper.Map<PurchaseOrderDTO>(purchaseOrderDoc);
            }).ToList();

            return purchaseOrderDTOs;
        }

        public async Task<PurchaseOrderDTO> GetPurchaseOrderDTOByIdAsync(string id)
        {
            var purchaseOrderDoc = await GetPurchaseOrderDocumentByIdAsync(id);

            var purchaseOrderDTO = _mapper.Map<PurchaseOrderDTO>(purchaseOrderDoc);

            return purchaseOrderDTO;
        }

        public async Task<PurchaseOrderDTO> AddPurchaseOrderDTOAsync(PurchaseOrderDTO purchaseOrderDTO)
        {
            // validate unique purchase order


            var purchaseOrderDoc = _mapper.Map<PurchaseOrderDocument>(purchaseOrderDTO);
            await PopulateDataToNewPurchaseOrder(purchaseOrderDoc);

            var createdDocument = await AddPurchaseOrderDocumentAsync(purchaseOrderDoc);

            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(purchaseOrderNewIdCacheName, IdUtils.IncreaseId(purchaseOrderDoc.Id));

                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    purchaseOrderDoc.StaffId,
                    "Đơn nhập hàng",
                    purchaseOrderDoc.PurchaseOrderId
                );

                _searchService.InsertToBatch(_purchaseOrderBatch, createdDocument.Resource, BatchAction.Upload);
                await _searchService.ExecuteBatchIndex(_purchaseOrderBatch);

                _logger.LogInformation($"[PurchaseOrderRepository] Uploaded new purchaseOrder {createdDocument.Resource.Id} to index");


                return _mapper.Map<PurchaseOrderDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }


        public async Task UpdatePurchaseOrderAsync(PurchaseOrderDTO purchaseOrderDTO)
        {
            var purchaseOrderToUpdate = _mapper.Map<PurchaseOrderDocument>(purchaseOrderDTO);
            
            purchaseOrderToUpdate.MonthYear ??= purchaseOrderToUpdate.CreatedAt!.Value.ToString("yyyy-MM");
            purchaseOrderToUpdate.ModifiedAt = DateTime.UtcNow;

            await _purchaseOrderContainer.UpsertItemAsync(
                item: purchaseOrderToUpdate,
                partitionKey: new PartitionKey(purchaseOrderToUpdate.MonthYear)
            );

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.update,
                purchaseOrderToUpdate.StaffId,
                "Đơn nhập hàng",
                purchaseOrderToUpdate.PurchaseOrderId
            );
            _searchService.InsertToBatch(_purchaseOrderBatch, purchaseOrderToUpdate, BatchAction.Merge);
            await _searchService.ExecuteBatchIndex(_purchaseOrderBatch);

            _logger.LogInformation($"[PurchaseOrderRepository] Merged uploaded purchaseOrder {purchaseOrderToUpdate.Id} to index");

        }

        private async Task<string> GetNewPurchaseOrderIdAsync()
        {
            if (_memoryCache.TryGetValue(purchaseOrderNewIdCacheName, out string? lastestId))
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

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_purchaseOrderContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set("LastestPurchaseOrderId", newId);
            return newId;
        }

        private async Task PopulateDataToNewPurchaseOrder(PurchaseOrderDocument purchaseOrderDoc)
        {
            purchaseOrderDoc.Id = await GetNewPurchaseOrderIdAsync();
            purchaseOrderDoc.PurchaseOrderId = purchaseOrderDoc.Id;

            purchaseOrderDoc.PaymentDetails ??= new()
            {
                PaymentMethod = "",

            };
            purchaseOrderDoc.PaymentDetails.Status = DocumentStatusUtils.GetPaymentStatus(
                purchaseOrderDoc.PaymentDetails.RemainAmount
            );

            purchaseOrderDoc.Status ??= "Completed";
            purchaseOrderDoc.Note ??= "";
            purchaseOrderDoc.Tags ??= new();
            //purchaseOrderDoc.IsRemovable = true;
            //purchaseOrderDoc.IsDeleted = false;
        }

        private async Task<PurchaseOrderDocument?> GetPurchaseOrderDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po " +
                    "WHERE po.id = @id"
            ).WithParameter("@id", id);

            var purchaseOrder = await CosmosDbUtils.GetDocumentByQueryDefinition<PurchaseOrderDocument>(_purchaseOrderContainer, queryDef);

            return purchaseOrder;
        }

        private async Task<ItemResponse<PurchaseOrderDocument>> AddPurchaseOrderDocumentAsync(PurchaseOrderDocument item)
        {
            try
            {
                item.CreatedAt = DateTime.UtcNow;
                item.MonthYear = item.CreatedAt.Value.ToString("yyyy-MM");
                item.ModifiedAt = item.CreatedAt;

                var response = await _purchaseOrderContainer.UpsertItemAsync(
                    item: item,
                    partitionKey: new PartitionKey(item.MonthYear)
                );

                return response;
            }
            catch (CosmosException)
            {
                // unhandled
                throw new Exception("An exception thrown when creating the purchase order document");
            }
        }
    }
}
