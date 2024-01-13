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
using Azure.Search.Documents.Models;

namespace BookstoreWebAPI.Repository
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly string salesOrderNewIdCacheName = "LastestSalesOrderId";
        private Container _salesOrderContainer;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly ILogger<SalesOrderRepository> _logger;
        private readonly AzureSearchClientService _searchService;
        private readonly IndexDocumentsBatch<SearchDocument> _salesOrderBatch;

        public int TotalCount {  get; private set; }

        public SalesOrderRepository(
            CosmosClient cosmosClient,
            IMapper mapper,
            IMemoryCache memoryCache,
            ILogger<SalesOrderRepository> logger,
            IActivityLogRepository activityLogRepository,
            AzureSearchServiceFactory searchServiceFactory)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "salesOrders";

            _salesOrderContainer = cosmosClient.GetContainer(databaseName, containerName);
            _searchService = searchServiceFactory.Create(containerName);
            _mapper = mapper;
            _memoryCache = memoryCache;
            _logger = logger;
            _activityLogRepository = activityLogRepository;
            _salesOrderBatch = new();
        }

        public async Task<IEnumerable<SalesOrderDTO>> GetSalesOrderDTOsAsync(QueryParameters queryParams, SalesOrderFilterModel filter)
        {
            filter.Query ??= "*";
            var options = AzureSearchUtils.BuildOptions(queryParams, filter);
            var searchResult = await _searchService.SearchAsync<SalesOrderDocument>(filter.Query, options);
            TotalCount = searchResult.TotalCount;
            var salesOrderDocs = searchResult.Results; 
            var salesOrderDTOs = salesOrderDocs.Select(salesOrderDoc =>
            {
                return _mapper.Map<SalesOrderDTO>(salesOrderDoc);
            }).ToList();

            return salesOrderDTOs;
        }

        public async Task<SalesOrderDTO?> GetSalesOrderDTOByIdAsync(string id)
        {
            var salesOrderDoc = await GetSalesOrderDocumentByIdAsync(id);

            var salesOrderDTO = _mapper.Map<SalesOrderDTO>(salesOrderDoc);

            return salesOrderDTO;
        }

        public async Task<SalesOrderDTO> AddSalesOrderDTOAsync(SalesOrderDTO salesOrderDTO)
        {
            // validation for uniqueness

            var salesOrderDoc = _mapper.Map<SalesOrderDocument>(salesOrderDTO);
            await PopulateDataToNewSalesOrderDocument(salesOrderDoc);

            var createdDocument = await AddSalesOrderDocumentAsync(salesOrderDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(salesOrderNewIdCacheName, IdUtils.IncreaseId(salesOrderDoc.Id));

                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    salesOrderDoc.StaffId,
                    "Đơn bán hàng",
                    salesOrderDoc.SalesOrderId
                );

                _searchService.InsertToBatch(_salesOrderBatch, createdDocument.Resource, BatchAction.Upload);
                await _searchService.ExecuteBatchIndex(_salesOrderBatch);

                _logger.LogInformation($"[SalesOrderRepository] Uploaded new salesOrder {createdDocument.Resource.Id} to index");

                return _mapper.Map<SalesOrderDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }

        private async Task PopulateDataToNewSalesOrderDocument(SalesOrderDocument salesOrderDoc)
        {
            var newId = await GetNewSalesOrderIdAsync();
            salesOrderDoc.Id = newId;
            salesOrderDoc.SalesOrderId = newId;

            salesOrderDoc.Note ??= "";
        }

        public async Task UpdateSalesOrderDTOAsync(SalesOrderDTO salesOrderDTO)
        {
            var salesOrderToUpdate = _mapper.Map<SalesOrderDocument>(salesOrderDTO);
            salesOrderToUpdate.MonthYear = salesOrderToUpdate.CreatedAt!.Value.ToString("yyyy-MM");
            salesOrderToUpdate.ModifiedAt = DateTime.UtcNow;

            await _salesOrderContainer.UpsertItemAsync(
                item: salesOrderToUpdate,
                partitionKey: new PartitionKey(salesOrderToUpdate.MonthYear)
            );

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.update,
                salesOrderToUpdate.StaffId,
                "Đơn bán hàng",
                salesOrderToUpdate.SalesOrderId
            );

            _searchService.InsertToBatch(_salesOrderBatch, salesOrderToUpdate, BatchAction.Merge);
            await _searchService.ExecuteBatchIndex(_salesOrderBatch);

            _logger.LogInformation($"[SalesOrderRepository] Merged uploaded salesOrder {salesOrderToUpdate.Id} to index");

        }

        public async Task<string> GetNewSalesOrderIdAsync()
        {
            if (_memoryCache.TryGetValue(salesOrderNewIdCacheName, out string? lastestId))
            {
                if (!String.IsNullOrEmpty(lastestId))
                    return lastestId;
            }

            // Query the database to get the latest product ID
            QueryDefinition queryDef = new QueryDefinition(
                query:
                "SELECT TOP 1 so.id " +
                "FROM so " +
                "ORDER BY so.id DESC"
            );

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_salesOrderContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(salesOrderNewIdCacheName, newId);
            return newId;
        }

        private async Task<SalesOrderDocument?> GetSalesOrderDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM so " +
                    "WHERE so.id = @id"
            ).WithParameter("@id", id);

            var salesOrder = await CosmosDbUtils.GetDocumentByQueryDefinition<SalesOrderDocument>(_salesOrderContainer, queryDef);

            return salesOrder;
        }



        private async Task<ItemResponse<SalesOrderDocument>> AddSalesOrderDocumentAsync(SalesOrderDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.MonthYear = item.CreatedAt.Value.ToString("yyyy-MM");
            item.ReturnDate = item.CreatedAt.Value.AddDays(5);
            item.ModifiedAt = item.CreatedAt;

            return await _salesOrderContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.MonthYear)
            );
        }
    }
}
