using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;
using SE100_BookstoreWebAPI.Repository.Interfaces;
using SE100_BookstoreWebAPI.Utils;

namespace SE100_BookstoreWebAPI.Repository
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private Container _purchaseOrderContainer;

        public PurchaseOrderRepository(CosmosClient cosmosClient, IMapper mapper, IMemoryCache memoryCache)
        {
            this._mapper = mapper;
            this._memoryCache = memoryCache;
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "purchaseOrders";

            _purchaseOrderContainer = cosmosClient.GetContainer(databaseName, containerName);
        }

        public async Task AddPurchaseOrderDocumentAsync(PurchaseOrderDocument item)
        {
            await _purchaseOrderContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.MonthYear)
            );
        }

        public async Task AddPurchaseOrderDTOAsync(PurchaseOrderDTO purchaseOrderDTO)
        {
            var purchaseOrderDoc = _mapper.Map<PurchaseOrderDocument>(purchaseOrderDTO);

            await AddPurchaseOrderDocumentAsync(purchaseOrderDoc);
        }
        public async Task UpdatePurchaseOrderAsync(PurchaseOrderDTO purchaseOrderDTO)
        {
            var purchaseOrderToUpdate = _mapper.Map<PurchaseOrderDocument>(purchaseOrderDTO);

            await _purchaseOrderContainer.UpsertItemAsync(
                item: purchaseOrderToUpdate,
                partitionKey: new PartitionKey(purchaseOrderToUpdate.MonthYear)
            );
        }

        public async Task<IEnumerable<PurchaseOrderDTO>> GetPurchaseOrderDTOsAsync()
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM po"
            );

            var purchaseOrderDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<PurchaseOrderDocument>(_purchaseOrderContainer, queryDef);
            var purchaseOrderDTOs = purchaseOrderDocs.Select(purchaseOrderDoc =>
            {
                return _mapper.Map<PurchaseOrderDTO>(purchaseOrderDoc);
            }).ToList();

            return purchaseOrderDTOs;
        }

        public async Task<string> GetNewPurchaseOrderIdAsync()
        {
            if (_memoryCache.TryGetValue("LastestPurchaseOrderId", out string? lastestId))
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

        public async Task<PurchaseOrderDTO> GetPurchaseOrderDTOByIdAsync(string id)
        {
            var purchaseOrderDoc = await GetPurchaseOrderDocumentByIdAsync(id);

            var purchaseOrderDTO = _mapper.Map<PurchaseOrderDTO>(purchaseOrderDoc);

            return purchaseOrderDTO;
        }

        public async Task DeletePurchaseOrderAsync(string id)
        {
            var purchaseOrderDoc = await GetPurchaseOrderDocumentByIdAsync(id);

            if (purchaseOrderDoc == null)
            {
                throw new Exception("PurchaseOrder Not found!");
            }

            List<PatchOperation> patchOperations = new List<PatchOperation>()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _purchaseOrderContainer.PatchItemAsync<PurchaseOrderDocument>(id, new PartitionKey(purchaseOrderDoc.MonthYear), patchOperations);
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
    }
}
