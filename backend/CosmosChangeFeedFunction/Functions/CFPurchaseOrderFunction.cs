using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFPurchaseOrderFunction(
        ILoggerFactory loggerFactory,
        IInventoryRepository inventoryRepository,
        AzureSearchClientFactory searchClientFactory
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFPurchaseOrderFunction>();
        private readonly AzureSearchClientService _purchaseOrderSearchClientService = searchClientFactory.Create("bookstore-purchaseorders-cosmosdb-index");

        [Function("CFPurchaseOrderFunction")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "purchaseOrders",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<PurchaseOrder> input)
        {
            if (input != null && input.Count > 0)
            {
                var purchaseOrderBatch = new IndexDocumentsBatch<SearchDocument>();

                foreach (var updatedPurchaseOrder in input)
                {
                    if (updatedPurchaseOrder == null)
                        continue;

                    if (updatedPurchaseOrder.CreatedAt == updatedPurchaseOrder.ModifiedAt)
                    {
                        _logger.LogInformation($"[CFCategory] Updating purchaseOrder id: {updatedPurchaseOrder.Id}");

                        foreach (var item in updatedPurchaseOrder.Items)
                        {
                            _logger.LogInformation($"[CFPurchaseOrder] Updating PO's item stock, product id: {item.ProductId}");

                            await inventoryRepository.UpdateStockFromPO(item.ProductId, item.OrderQuantity);
                        }

                        //_purchaseOrderSearchClientService.InsertToBatch(purchaseOrderBatch, updatedPurchaseOrder, BatchAction.Upload);
                    }
                    else
                    {
                        _logger.LogInformation($"[CFCategory] Creating purchaseOrder id: {updatedPurchaseOrder.Id}");

                    }

                    _purchaseOrderSearchClientService.InsertToBatch(purchaseOrderBatch, updatedPurchaseOrder, BatchAction.MergeOrUpload);
                }


                await _purchaseOrderSearchClientService.ExecuteBatchIndex(purchaseOrderBatch);
                _logger.LogInformation($"[CFPurchaseOrder] Executed batch purchaseOrder, count: {purchaseOrderBatch.Actions.Count}");
            }
        }
    }
}
