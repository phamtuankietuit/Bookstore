using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using System.Reflection.Metadata.Ecma335;

namespace CosmosChangeFeedFunction.Repositories
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly Container _inventoryContainer;
        private readonly ILogger _logger;

        public InventoryRepository(CosmosClient cosmosClient, ILoggerFactory loggerFactory)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _inventoryContainer = cosmosClient.GetContainer(databaseName, "inventories");
            _logger = loggerFactory.CreateLogger<InventoryRepository>();
        }

        public async Task UpdateProductNameInside(string productId, string newProductName)
        {
            var inventoryToUpdate = await GetInventoryByProductId(productId);

            if (inventoryToUpdate == null)
            {
                return;
            }

            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/productName", newProductName),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            await _inventoryContainer.PatchItemAsync<Inventory>(inventoryToUpdate.Id, new PartitionKey(inventoryToUpdate.Sku), operations);
            
            _logger.LogInformation("updated product name after update product");
        }

        public async Task UpdateStockFromPO(string productId, int importQuantity)
        {
            var inventoryToUpdate = await GetInventoryByProductId(productId);

            if (inventoryToUpdate == null)
            {
                _logger.LogError($"Inventory of Product {productId} not found");
                return;
            }

            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/currentStock", inventoryToUpdate.CurrentStock + importQuantity),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            await _inventoryContainer.PatchItemAsync<Inventory>(inventoryToUpdate.Id, new PartitionKey(inventoryToUpdate.Sku), operations);

            _logger.LogInformation("updated current stock after create purchaseOrder (import)");
        }

        public async Task UpdateStockFromSO(string productId, int saleQuantity)
        {
            var inventoryToUpdate = await GetInventoryByProductId(productId);

            if (inventoryToUpdate == null)
            {
                _logger.LogError($"Inventory of Product {productId} not found");

                return;
            }

            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/currentStock", inventoryToUpdate.CurrentStock - saleQuantity),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            
            await _inventoryContainer.PatchItemAsync<Inventory>(inventoryToUpdate.Id, new PartitionKey(inventoryToUpdate.Sku), operations);

            _logger.LogInformation("updated current stock after create salesOrder (sell)");
        }

        private async Task<Inventory?> GetInventoryByProductId(string productId)
        {
            var queryDef = new QueryDefinition(
                query:
                    " SELECT * " +
                    " FROM c " +
                    " WHERE c.productId = @productId and c.isDeleted = false"
            ).WithParameter("@productId", productId);

            var inventory = await CosmosDbUtils.GetDocumentByQueryDefinition<Inventory>(_inventoryContainer, queryDef);

            _logger.LogInformation($"[InventoryRepo] Get inventory by id: {inventory?.Id}");
            return inventory;
        }
    }
}
