using AutoMapper;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Caching.Memory;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using BookstoreWebAPI.Models.Responses;

namespace BookstoreWebAPI.Repository
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private Container _salesOrderContainer;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;

        public SalesOrderRepository(CosmosClient cosmosClient, IMapper mapper, IMemoryCache memoryCache)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "salesOrders";

            _salesOrderContainer = cosmosClient.GetContainer(databaseName, containerName);
            this._mapper = mapper;
            this._memoryCache = memoryCache;
        }

        public async Task AddSalesOrderDTOAsync(SalesOrderDTO salesOrderDTO)
        {
            var salesOrderDoc = _mapper.Map<SalesOrderDocument>(salesOrderDTO);

            await AddSalesOrderDocumentAsync(salesOrderDoc);
        }

        public async Task UpdateSalesOrderAsync(SalesOrderDTO salesOrderDTO)
        {
            var salesOrderToUpdate = _mapper.Map<SalesOrderDocument>(salesOrderDTO);

            await _salesOrderContainer.UpsertItemAsync(
                item: salesOrderToUpdate,
                partitionKey: new PartitionKey(salesOrderToUpdate.MonthYear)
            );
        }

        public async Task<IEnumerable<SalesOrderDTO>> GetSalesOrderDTOsAsync()
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM so"
            );

            var salesOrderDocs = await CosmosDbUtils.GetDocumentsByQueryDefinition<SalesOrderDocument>(_salesOrderContainer, queryDef);
            var salesOrderDTOs = salesOrderDocs.Select(salesOrderDoc =>
            {
                return _mapper.Map<SalesOrderDTO>(salesOrderDoc);
            }).ToList();

            return salesOrderDTOs;
        }

        public async Task<string> GetNewOrderIdAsync()
        {
            if (_memoryCache.TryGetValue("LastestSalesOrderId", out string? lastestId))
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

            _memoryCache.Set("LastestSalesOrderId", newId);
            return newId;
        }

        public async Task<SalesOrderDTO> GetSalesOrderDTOByIdAsync(string id)
        {
            var salesOrderDoc = await GetSalesOrderDocumentByIdAsync(id);

            var salesOrderDTO = _mapper.Map<SalesOrderDTO>(salesOrderDoc);

            return salesOrderDTO;
        }

        public async Task DeleteSalesOrderAsync(string id)
        {
            var salesOrderDoc = await GetSalesOrderDocumentByIdAsync(id);

            if (salesOrderDoc == null)
            {
                throw new Exception("SalesOrder Not found!");
            }

            List<PatchOperation> patchOperations = new List<PatchOperation>()
            {
                PatchOperation.Replace("/isDeleted", true)
            };

            await _salesOrderContainer.PatchItemAsync<SalesOrderDocument>(id, new PartitionKey(salesOrderDoc.MonthYear), patchOperations);
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

        public async Task AddSalesOrderDocumentAsync(SalesOrderDocument item)
        {
            item.CreatedAt = DateTime.UtcNow;

            await _salesOrderContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.MonthYear)
            );
        }
    }
}
