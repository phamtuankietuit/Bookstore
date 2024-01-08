using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFCustomerFunction(
        ILoggerFactory loggerFactory,
        AzureSearchClientFactory searchClientFactory
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFCustomerFunction>();
        private readonly AzureSearchClientService _customerSearchClientService = searchClientFactory.Create("bookstore-customers-cosmosdb-index");


        [Function("CFCustomerFunction")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "customers",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<Customer> input)
        {
            if (input != null && input.Count > 0)
            {
                var customerBatch = new IndexDocumentsBatch<SearchDocument>();

                foreach (var updatedCustomer in input)
                {
                    if (updatedCustomer == null)
                        continue;


                    // add to batch to update index

                    if (updatedCustomer.IsDeleted && updatedCustomer.TTL == -1)
                    {
                        _logger.LogInformation($"[CFCustomer] Deleting customer, customer id: {updatedCustomer.Id} ");
                        // perform a hard delete if you want - remember to call searchclient to delete from index

                        // call Merge if perform soft delete
                        _customerSearchClientService.InsertToBatch(customerBatch, updatedCustomer, BatchAction.Merge);
                    }
                    else if (!updatedCustomer.IsDeleted)
                    {
                        if (updatedCustomer.CreatedAt != updatedCustomer.ModifiedAt)
                        {
                            _logger.LogInformation($"[CFCustomer] Updating customer, customer id: {updatedCustomer.Id} ");

                            _customerSearchClientService.InsertToBatch(customerBatch, updatedCustomer, BatchAction.Merge);
                        }
                        else
                        {
                            _logger.LogInformation($"[CFCustomer] Creating customer, customer id: {updatedCustomer.Id} ");

                            _customerSearchClientService.InsertToBatch(customerBatch, updatedCustomer, BatchAction.Upload);
                        }
                    }

                }

                await _customerSearchClientService.ExecuteBatchIndex(customerBatch);
                _logger.LogInformation($"[CFCustomer] Executed batch customer, count: {customerBatch.Actions.Count}");

            }
        }
    }
}
