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
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.Shared;
using Azure.Search.Documents.Models;

namespace BookstoreWebAPI.Repository
{
    public class ReturnOrderRepository : IReturnOrderRepository
    {
        private readonly string returnOrderNewIdCacheName = "LastestReturnOrderId";
        private Container _returnOrderContainer;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly ILogger<ReturnOrderRepository> _logger;
        private readonly AzureSearchClientService _searchService;
        private readonly UserContextService _userContextService;
        private readonly IndexDocumentsBatch<SearchDocument> _returnOrderBatch;

        public int TotalCount { get; private set; }

        public ReturnOrderRepository(
            CosmosClient cosmosClient,
            IMapper mapper,
            IMemoryCache memoryCache,
            ILogger<ReturnOrderRepository> logger,
            IActivityLogRepository activityLogRepository,
            AzureSearchServiceFactory searchServiceFactory,
            ISalesOrderRepository salesOrderRepository,
            UserContextService userContextService,
            IStaffRepository staffRepository)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "returnOrders";

            _returnOrderContainer = cosmosClient.GetContainer(databaseName, containerName);
            _searchService = searchServiceFactory.Create(containerName);
            _mapper = mapper;
            _memoryCache = memoryCache;
            _logger = logger;
            _activityLogRepository = activityLogRepository;
            _salesOrderRepository = salesOrderRepository;
            _userContextService = userContextService;
            _staffRepository = staffRepository;
            _returnOrderBatch = new();
        }

        public async Task<IEnumerable<ReturnOrderDTO>> GetReturnOrderDTOsAsync(QueryParameters queryParams, ReturnOrderFilterModel filter)
        {
            IEnumerable<ReturnOrderDocument?> returnOrderDocs = [];

            if (filter.Query == null)
            {
                var queryDef = CosmosDbUtils.BuildQuery(queryParams, filter, isRemovableDocument: false);
                returnOrderDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<ReturnOrderDocument>(_returnOrderContainer, queryDef);
                TotalCount = returnOrderDocs == null ? 0 : returnOrderDocs.Count();

                if (queryParams.PageSize != -1)
                {
                    queryParams.PageSize = -1;
                    var queryDefGetAll = CosmosDbUtils.BuildQuery(queryParams, filter, isRemovableDocument: false);
                    var allReturnOrderDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<ReturnOrderDocument>(_returnOrderContainer, queryDefGetAll);
                    TotalCount = allReturnOrderDocs == null ? 0 : allReturnOrderDocs.Count();
                }
            }
            else
            {
                var options = AzureSearchUtils.BuildOptions(queryParams, filter);
                var searchResult = await _searchService.SearchAsync<ReturnOrderDocument>(filter.Query, options);
                TotalCount = searchResult.TotalCount;
                returnOrderDocs = searchResult.Results;
            }

            var returnOrderDTOs = returnOrderDocs.Select(returnOrderDoc =>
            {
                return _mapper.Map<ReturnOrderDTO>(returnOrderDoc);
            }).ToList();

            return returnOrderDTOs;
        }

        public async Task<ReturnOrderDTO?> GetReturnOrderDTOByIdAsync(string id)
        {
            var returnOrderDoc = await GetReturnOrderDocumentByIdAsync(id);

            var returnOrderDTO = _mapper.Map<ReturnOrderDTO>(returnOrderDoc);

            return returnOrderDTO;
        }


        public async Task<ReturnOrderDTO?> GetInitReturnOrderDTO(string salesOrderId)
        {
            var salesOrderToReturn = await _salesOrderRepository.GetSalesOrderDTOByIdAsync(salesOrderId);

            if (salesOrderToReturn == null)
                return null;

            if (salesOrderToReturn.ReturnDate < DateTime.UtcNow || await HasReturnedOrder(salesOrderId))
                throw new OrderReturnNotAllowedException();

            string staffId = _userContextService.Current.StaffId;
            
            var staffDoc = await _staffRepository.GetStaffDTOByIdAsync(staffId)
                ?? throw new TrackingAccountNotFoundException();
            

            string newReturnOrderId = await GetNewReturnOrderIdAsync();
            ReturnOrderDTO returnOrder = new()
            {
                ReturnOrderId = newReturnOrderId,
                SalesOrderId = salesOrderId,
                CustomerId = salesOrderToReturn.CustomerId,
                CustomerName = salesOrderToReturn.CustomerName,
                StaffId = staffId,
                StaffName = staffDoc.Name,
                Items = salesOrderToReturn.Items
                    .Select(soItem =>
                    {
                        var returnItem = _mapper.Map<ReturnOrderItem>(soItem);

                        var subtotal = salesOrderToReturn.Subtotal;
                        var totalDiscount = salesOrderToReturn.DiscountValue;
                        var proportion = soItem.TotalPrice / subtotal;
                        var refund = soItem.SalePrice - proportion * totalDiscount;
                        returnItem.Refund = VariableHelpers.RoundToThoudsand(refund);
                        returnItem.ReturnQuantity = 0;
                        returnItem.TotalRefund = 0;
                        return returnItem;
                    }).ToList(),
                TotalItem = salesOrderToReturn.Items.Count,
                TotalQuantity = 0,
                TotalAmount = 0,
                Note = "",
                CreatedAt = DateTime.UtcNow,
                ModifiedAt = DateTime.UtcNow
            };
            
            return returnOrder;
        }

        public async Task<ReturnOrderDTO> AddReturnOrderDTOAsync(ReturnOrderDTO returnOrderDTO)
        {
            // validation for uniqueness

            var returnOrderDoc = _mapper.Map<ReturnOrderDocument>(returnOrderDTO);
            await PopulateDataToNewReturnOrderDocument(returnOrderDoc);

            var createdDocument = await AddReturnOrderDocumentAsync(returnOrderDoc);
            if (createdDocument.StatusCode == System.Net.HttpStatusCode.Created)
            {
                _memoryCache.Set(returnOrderNewIdCacheName, IdUtils.IncreaseId(returnOrderDoc.Id));

                await _activityLogRepository.LogActivity(
                    Enums.ActivityType.create,
                    _userContextService.Current.StaffId,
                    "Đơn trả hàng",
                    returnOrderDoc.ReturnOrderId
                );

                _searchService.InsertToBatch(_returnOrderBatch, createdDocument.Resource, BatchAction.Upload);
                await _searchService.ExecuteBatchIndex(_returnOrderBatch);

                _logger.LogInformation($"[ReturnOrderRepository] Uploaded new returnOrder {createdDocument.Resource.Id} to index");


                return _mapper.Map<ReturnOrderDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }

        private async Task PopulateDataToNewReturnOrderDocument(ReturnOrderDocument returnOrderDoc)
        {
            var newId = await GetNewReturnOrderIdAsync();
            returnOrderDoc.Id = newId;
            returnOrderDoc.ReturnOrderId = newId;

            returnOrderDoc.Note ??= "";
        }

        public async Task UpdateReturnOrderDTOAsync(ReturnOrderDTO returnOrderDTO)
        {
            var returnOrderToUpdate = _mapper.Map<ReturnOrderDocument>(returnOrderDTO);
            returnOrderToUpdate.ModifiedAt = DateTime.UtcNow;

            await _returnOrderContainer.UpsertItemAsync(
                item: returnOrderToUpdate,
                partitionKey: new PartitionKey(returnOrderToUpdate.SalesOrderId)
            );

            await _activityLogRepository.LogActivity(
                Enums.ActivityType.update,
                returnOrderToUpdate.StaffId,
                "Đơn trả hàng",
                returnOrderToUpdate.ReturnOrderId
            );


            _searchService.InsertToBatch(_returnOrderBatch, returnOrderToUpdate, BatchAction.Merge);
            await _searchService.ExecuteBatchIndex(_returnOrderBatch);

            _logger.LogInformation($"[ReturnOrderRepository] Merged uploaded returnOrder {returnOrderToUpdate.Id} to index");

        }

        private async Task<string> GetNewReturnOrderIdAsync()
        {
            if (_memoryCache.TryGetValue(returnOrderNewIdCacheName, out string? lastestId))
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

            string currLastestId = (await CosmosDbUtils.GetDocumentByQueryDefinition<ResponseToGetId>(_returnOrderContainer, queryDef))!.Id;
            string newId = IdUtils.IncreaseId(currLastestId);

            _memoryCache.Set(returnOrderNewIdCacheName, newId);
            return newId;
        }

        private async Task<ReturnOrderDocument?> GetReturnOrderDocumentByIdAsync(string id)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM so " +
                    "WHERE so.id = @id"
            ).WithParameter("@id", id);

            var returnOrder = await CosmosDbUtils.GetDocumentByQueryDefinition<ReturnOrderDocument>(_returnOrderContainer, queryDef);

            return returnOrder;
        }

        private async Task<bool> HasReturnedOrder(string salesOrderId)
        {
            var queryDef = new QueryDefinition(
                "SELECT * " +
                "FROM c " +
                "WHERE STRINGEQUALS(c.salesOrderId,@salesOrderId)"
            ).WithParameter("@salesOrderId", salesOrderId);


            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<ReturnOrderDocument>(_returnOrderContainer, queryDef);

            return result != null;
        }

        private async Task<ItemResponse<ReturnOrderDocument>> AddReturnOrderDocumentAsync(ReturnOrderDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.ModifiedAt = item.CreatedAt;

            return await _returnOrderContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.SalesOrderId)
            );
        }
    }
}
