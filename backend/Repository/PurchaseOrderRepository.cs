using Microsoft.Azure.Cosmos;
using SE100_BookstoreWebAPI.Models.Documents;

namespace SE100_BookstoreWebAPI.Repository
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private Container _purchaseOrderContainer;

        public PurchaseOrderRepository(CosmosClient cosmosClient)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "purchaseOrders";

            _purchaseOrderContainer = cosmosClient.GetContainer(databaseName, containerName);
        }

        public async Task AddPurchaseOrderAsync(PurchaseOrderDocument item)
        {
            await _purchaseOrderContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.MonthYear)
            );
        }
    }
}
