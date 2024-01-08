using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFSalesOrderFunction(
        ILoggerFactory loggerFactory,
        IInventoryRepository inventoryRepository,
        AzureSearchClientFactory searchClientFactory
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFSalesOrderFunction>();
        private readonly AzureSearchClientService _salesOrderSearchClientService = searchClientFactory.Create("bookstore-salesorders-cosmosdb-index");


        [Function("CFSalesOrderFunction")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "salesOrders",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<SalesOrder> input)
        {
            if (input != null && input.Count > 0)
            {
                var salesOrderBatch = new IndexDocumentsBatch<SearchDocument>();

                foreach (var updatedSalesOrder in input)
                {
                    if (updatedSalesOrder == null)
                        continue;

                    if (updatedSalesOrder.CreatedAt == updatedSalesOrder.ModifiedAt)
                    {
                        _logger.LogInformation($"[CFCategory] Updating salesOrder id: {updatedSalesOrder.Id}");

                        foreach (var item in updatedSalesOrder.Items)
                        {
                            _logger.LogInformation($"[CFSalesOrder] Updating PO's item stock, product id: {item.ProductId}");

                            await inventoryRepository.UpdateStockFromSO(item.ProductId, item.Quantity);
                        }

                        _salesOrderSearchClientService.InsertToBatch(salesOrderBatch, updatedSalesOrder, BatchAction.Upload);
                    }
                    else
                    {
                        _logger.LogInformation($"[CFCategory] Creating salesOrder id: {updatedSalesOrder.Id}");

                        _salesOrderSearchClientService.InsertToBatch(salesOrderBatch, updatedSalesOrder, BatchAction.Merge);
                    }    

                    await _salesOrderSearchClientService.ExecuteBatchIndex(salesOrderBatch);
                    _logger.LogInformation($"[CFSalesOrder] Executed batch salesOrder, count: {salesOrderBatch.Actions.Count}");
                }
            }
        }
    }
}
