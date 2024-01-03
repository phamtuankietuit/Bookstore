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
using BookstoreWebAPI.Models.Shared;

namespace BookstoreWebAPI.Repository
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly string purchaseOrderNewIdCacheName = "LastestPurchaseOrderId";
        private readonly ILogger<PurchaseOrderRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private Container _purchaseOrderContainer;

        public PurchaseOrderRepository(
            CosmosClient cosmosClient,
            ILogger<PurchaseOrderRepository> logger,
            IMapper mapper,
            IMemoryCache memoryCache)
        {
            _logger = logger;
            _mapper = mapper;
            _memoryCache = memoryCache;

            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "purchaseOrders";

            _purchaseOrderContainer = cosmosClient.GetContainer(databaseName, containerName);
        }

        public async Task<int> GetTotalCount(QueryParameters queryParams, PurchaseOrderFilterModel filter)
        {
            var tempQueryParams = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = -1
            };

            var queryDef = CosmosDbUtils.BuildQuery<PurchaseOrderDocument>(tempQueryParams, filter, isRemovableDocument:false);
            var purchaseOrders = await CosmosDbUtils.GetDocumentsByQueryDefinition<PurchaseOrderDTO>(_purchaseOrderContainer, queryDef);

            var count = purchaseOrders.Count();

            return count;
        }

        public async Task<IEnumerable<PurchaseOrderDTO>> GetPurchaseOrderDTOsAsync(QueryParameters queryParams, PurchaseOrderFilterModel filter)
        {
            var queryDef = CosmosDbUtils.BuildQuery<PurchaseOrderDocument>(queryParams, filter, isRemovableDocument:false);

            var purchaseOrderDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<PurchaseOrderDocument>(_purchaseOrderContainer, queryDef);
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
                return _mapper.Map<PurchaseOrderDTO>(createdDocument.Resource);
            }

            throw new ArgumentNullException(nameof(createdDocument));
        }





        public async Task UpdatePurchaseOrderAsync(PurchaseOrderDTO purchaseOrderDTO)
        {
            var purchaseOrderToUpdate = _mapper.Map<PurchaseOrderDocument>(purchaseOrderDTO);
            
            purchaseOrderToUpdate.CreatedAt ??= DateTime.UtcNow;
            purchaseOrderToUpdate.MonthYear ??= purchaseOrderToUpdate.CreatedAt.Value.ToString("MM-yyyy");

            await _purchaseOrderContainer.UpsertItemAsync(
                item: purchaseOrderToUpdate,
                partitionKey: new PartitionKey(purchaseOrderToUpdate.MonthYear)
            );
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

        public async Task<ItemResponse<PurchaseOrderDocument>> AddPurchaseOrderDocumentAsync(PurchaseOrderDocument item)
        {
            try
            {
                item.CreatedAt = DateTime.UtcNow;
                item.MonthYear = item.CreatedAt.Value.ToString("yyyy-MM");

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
