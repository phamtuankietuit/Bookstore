using System;
using System.Collections.Generic;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFProductFunction(
        ILoggerFactory loggerFactory,
        IInventoryRepository inventoryRepository,
        AzureSearchClientFactory searchClientFactory
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFProductFunction>();
        private readonly AzureSearchClientService _productSearchClientService = searchClientFactory.Create(indexName: "bookstore-products-cosmosdb-index");


        [Function("CFProductFunction")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "products",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<Product> input)
        {
            if (input != null && input.Count > 0)
            {
                var productBatch = new IndexDocumentsBatch<SearchDocument>();

                foreach (var updatedProduct in input)
                {
                    if (updatedProduct == null)
                        continue;

                    if (updatedProduct.IsDeleted && updatedProduct.TTL == -1)
                    {
                        _logger.LogInformation($"[CFProduct] Deleting product, product id: {updatedProduct.Id} ");
                        // perform a hard delete if you want - remember to call searchclient to delete from index

                        // call Merge if perform soft delete
                        _productSearchClientService.InsertToBatch(productBatch, updatedProduct, BatchAction.Merge);
                    }
                    else if (!updatedProduct.IsDeleted)
                    {
                        if (updatedProduct.CreatedAt != updatedProduct.ModifiedAt)
                        {
                            _logger.LogInformation($"[CFProduct] Updating product, product id: {updatedProduct.Id} ");

                            await inventoryRepository.UpdateProductNameInside(updatedProduct.ProductId, updatedProduct.Name);

                            _productSearchClientService.InsertToBatch(productBatch, updatedProduct, BatchAction.Merge);
                        }
                        else
                        {
                            _logger.LogInformation($"[CFProduct] Creating product, product id: {updatedProduct.Id} ");

                            _productSearchClientService.InsertToBatch(productBatch, updatedProduct, BatchAction.Upload);
                        }
                    }
                }


                await _productSearchClientService.ExecuteBatchIndex(productBatch);
                _logger.LogInformation($"[CFProduct] Executed batch product, count: {productBatch.Actions.Count}");
            }
        }
    }
}
