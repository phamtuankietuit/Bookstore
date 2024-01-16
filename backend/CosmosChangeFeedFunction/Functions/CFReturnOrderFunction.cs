using System;
using System.Collections.Generic;
using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.ApplicationInsights.WindowsServer;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFReturnOrderFunction(
        ILoggerFactory loggerFactory,
        AzureSearchClientFactory searchClientFactory,
        IInventoryRepository inventoryRepository,
        ICustomerRepository customerRepository
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFReturnOrderFunction>();
        private readonly AzureSearchClientService _returnSearchClientService = searchClientFactory.Create("bookstore-returnorders-cosmosdb-index");
        private readonly AzureSearchClientService _customerSearchClientService = searchClientFactory.Create("bookstore-customers-cosmosdb-index");

        [Function("CFReturnOrderFunction")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "returnOrders",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<ReturnOrder> input)
        {
            if (input != null && input.Count > 0)
            {


                var returnOderBatch = new IndexDocumentsBatch<SearchDocument>();
                var customerBatch = new IndexDocumentsBatch<SearchDocument>();


                foreach (var updatedReturnOrder in input)
                {
                    if (updatedReturnOrder == null)
                        continue;

                    if (updatedReturnOrder.CreatedAt == updatedReturnOrder.ModifiedAt)
                    {
                        _logger.LogInformation($"[CFCategory] Creating returnOrder id: {updatedReturnOrder.Id}");

                        foreach (var item in updatedReturnOrder.Items)
                        {
                            _logger.LogInformation($"[CFReturnOrder] Updating RO's item stock, product id: {item.ProductId}");

                            await inventoryRepository.UpdateStockFromRO(item.ProductId, item.ReturnQuantity);
                        }   

                        var updatedCustomer = await customerRepository.UpdateReturnOrderInformation(updatedReturnOrder);

                        if (updatedCustomer != null)
                        {
                            _customerSearchClientService.InsertToBatch(customerBatch, updatedCustomer, BatchAction.Merge);
                        }
                    }
                    else
                    {

                    }

                    _returnSearchClientService.InsertToBatch(returnOderBatch, updatedReturnOrder, BatchAction.MergeOrUpload);
                }


                await _returnSearchClientService.ExecuteBatchIndex(returnOderBatch);
                
            }
        }
    }
}
