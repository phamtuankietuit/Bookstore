using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;

namespace CosmosChangeFeedFunction.Repositories
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly Container _purchaseOrderContainer;

        public PurchaseOrderRepository(CosmosClient cosmosClient)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _purchaseOrderContainer = cosmosClient.GetContainer(databaseName, "purchaseOrders");
        }

        public async Task<PurchaseOrder?> GetPurchaseOrderByIdAsync(string purchaseOrderId)
        {
            var queryDef = new QueryDefinition(
                query:
                "SELECT * " +
                "FROM po " +
                "WHERE po.id = @id"
            ).WithParameter("@id", purchaseOrderId);

            var results = await CosmosDbUtils.GetDocumentByQueryDefinition<PurchaseOrder>(_purchaseOrderContainer, queryDef);

            return results;
        }
    }
}
