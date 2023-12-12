using Microsoft.Azure.Cosmos;
using SE100_BookstoreWebAPI.Models.Documents;

namespace SE100_BookstoreWebAPI.Repository
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private Container _salesOrderContainer;

        public SalesOrderRepository(CosmosClient cosmosClient)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "categories";

            _salesOrderContainer = cosmosClient.GetContainer(databaseName, containerName);
        }

        public async Task AddSalesOrderAsync(SalesOrderDocument item)
        {
            await _salesOrderContainer.UpsertItemAsync(
                item:item,
                partitionKey: new PartitionKey(item.MonthYear)
            );
        }
    }
}
