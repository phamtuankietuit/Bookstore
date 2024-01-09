using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFSupplierFunction(
        ILoggerFactory loggerFactory,
        IProductRepository productRepository,
        AzureSearchClientFactory searchClientFactory
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFSupplierFunction>();
        private readonly AzureSearchClientService _supplierSearchClientService = searchClientFactory.Create(indexName: "bookstore-suppliers-cosmosdb-index");
        private readonly AzureSearchClientService _productSearchClientService = searchClientFactory.Create(indexName: "bookstore-products-cosmosdb-index");


        [Function("CFSupplierFunction")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "suppliers",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<Supplier> input)
        {
            if (input != null && input.Count > 0)
            {
                var supplierBatch = new IndexDocumentsBatch<SearchDocument>();
                var productBatch = new IndexDocumentsBatch<SearchDocument>();


                foreach (var updatedSupplier in input)
                {
                    if (updatedSupplier == null)
                        continue;

                    IEnumerable<Product>? updatedProducts = null;

                    if (updatedSupplier.IsDeleted && updatedSupplier.TTL == -1)
                    {
                        _logger.LogInformation($"[CFSupplier] Deleting supplier id: {updatedSupplier.Id}");

                        updatedProducts = await productRepository.ResetSuppliersAsync(updatedSupplier.SupplierId);

                        // perform a hard delete if you want
                        //await supplierRepository.DeleteSupplierAsync(updatedSupplier);

                        // call Merge if perform a soft delete
                        //_supplierSearchClientService.InsertToBatch(supplierBatch, updatedSupplier, BatchAction.Merge);
                    }
                    else if (!updatedSupplier.IsDeleted)// Supplier is updated
                    {
                        if (updatedSupplier.CreatedAt != updatedSupplier.ModifiedAt)
                        {
                            _logger.LogInformation($"[CFSupplier] Updating supplier id: {updatedSupplier.Id}");

                            updatedProducts = await productRepository.UpdateSuppliersAsync(updatedSupplier.SupplierId);

                            //_supplierSearchClientService.InsertToBatch(supplierBatch, updatedSupplier, BatchAction.Merge);
                        }
                        else
                        {
                            _logger.LogInformation($"[CFSupplier] Creating supplier id: {updatedSupplier.Id}");

                        }
                    }


                    if (updatedProducts != null)
                    {
                        foreach (var updatedProduct in updatedProducts)
                        {
                            _productSearchClientService.InsertToBatch(productBatch, updatedProduct, BatchAction.Merge);
                        }
                    }
                    
                    
                    _supplierSearchClientService.InsertToBatch(supplierBatch, updatedSupplier, BatchAction.MergeOrUpload);
                }

                await _supplierSearchClientService.ExecuteBatchIndex(supplierBatch);
                _logger.LogInformation($"[CFSupplier] Executed batch supplier, count: {supplierBatch.Actions.Count}");

                await _productSearchClientService.ExecuteBatchIndex(productBatch);
                _logger.LogInformation($"[CFSupplier] Executed batch product, count: {productBatch.Actions.Count}");

            }
        }
    }
}
