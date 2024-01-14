using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;

namespace CosmosChangeFeedFunction.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly Container _customerContainer;

        public CustomerRepository(CosmosClient cosmosClient)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _customerContainer = cosmosClient.GetContainer(databaseName, "customers");
        }

        public async Task<Customer?> UpdateSalesOrderInformation(SalesOrder salesOrder)
        {
            string customerId = salesOrder.CustomerId;

            if (customerId == "cust00000")
            {
                return null;
            }

            Customer? customerToUpdate = await GetCustomerByIdAsync(customerId);

            if (customerToUpdate == null)
            {
                return null;
            }

            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/salesOrderInformation/lastOrderAt", DateTime.UtcNow),
                PatchOperation.Replace("/salesOrderInformation/purchasedOrder", customerToUpdate.SalesOrderInformation.OrderedQuantity++),
                PatchOperation.Replace("/salesOrderInformation/orderedQuantity", customerToUpdate.SalesOrderInformation.OrderedQuantity + salesOrder.Items.Count),
                PatchOperation.Replace("/salesOrderInformation/totalPay", customerToUpdate.SalesOrderInformation.TotalPay + salesOrder.TotalAmount),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            await _customerContainer.PatchItemAsync<Customer>(customerId, new PartitionKey(customerToUpdate.Id), operations);

            return customerToUpdate;
        }

        public async Task<Customer?> UpdateReturnOrderInformation(ReturnOrder returnOrder)
        {
            string customerId = returnOrder.CustomerId;

            if (customerId == "cust00000")
            {
                return null;
            }

            Customer? customerToUpdate = await GetCustomerByIdAsync(customerId);

            if (customerToUpdate == null)
            {
                return null;
            }

            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/salesOrderInformation/returnQuantity", customerToUpdate.SalesOrderInformation.ReturnQuantity + returnOrder.Items.Count),
                PatchOperation.Replace("/salesOrderInformation/totalPay", customerToUpdate.SalesOrderInformation.TotalPay - returnOrder.TotalAmount),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            await _customerContainer.PatchItemAsync<Customer>(customerId, new PartitionKey(customerToUpdate.Id), operations);

            return customerToUpdate;
        }

        private async Task<Customer?> GetCustomerByIdAsync(string customerId)
        {
            var queryDef = new QueryDefinition(
                query: "SELECT * " +
                " FROM c" +
                " WHERE c.customerId = @customerId"
            ).WithParameter("@customerId", customerId);

            var customer = await CosmosDbUtils.GetDocumentByQueryDefinition<Customer>(_customerContainer, queryDef);

            return customer;
        }
    }
}
