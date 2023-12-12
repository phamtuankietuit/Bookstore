using Microsoft.Azure.Cosmos;
using SE100_BookstoreWebAPI.Models.Documents;

namespace SE100_BookstoreWebAPI.Repository
{
    public class SupplierRepository : ISupplierRepository
    {
        private Container _supplierContainer;

        public SupplierRepository(CosmosClient cosmosClient)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "suppliers";

            _supplierContainer = cosmosClient.GetContainer(databaseName, containerName);
        }

        public async Task AddSupplierAsync(SupplierDocument item)
        {
            await _supplierContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.SupplierId)
            );
        }
    }
}
