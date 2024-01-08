using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;



namespace CosmosChangeFeedFunction.Repositories
{
    public class SupplierGroupRepository: ISupplierGroupRepository
    {
        private Container _supplierGroupContainer;

        public SupplierGroupRepository(CosmosClient cosmosClient)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _supplierGroupContainer = cosmosClient.GetContainer(databaseName, "categories");
        }

        public async Task DeleteSupplierGroupAsync(SupplierGroup supplierGroup)
        {
            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/ttl", 1),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            await _supplierGroupContainer.PatchItemAsync<SupplierGroup>(supplierGroup.Id, new PartitionKey(supplierGroup.Id), operations);
        }

        public async Task<SupplierGroup?> GetSupplierGroupByIdAsync(string supplierGroupId)
        {
            QueryDefinition queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.supplierGroupId = @supplierGroupId"
            ).WithParameter("@supplierGroupId", supplierGroupId);

            var supplierGroup = await CosmosDbUtils.GetDocumentByQueryDefinition<SupplierGroup>(_supplierGroupContainer, queryDef);

            return supplierGroup;
        }
    }
}
