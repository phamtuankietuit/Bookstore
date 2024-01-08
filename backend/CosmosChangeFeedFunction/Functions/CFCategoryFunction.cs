using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFCategoryFunction(
        ILoggerFactory loggerFactory,
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        AzureSearchClientFactory searchClientFactory
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFCategoryFunction>();
        private readonly AzureSearchClientService _categorySearchClientService = searchClientFactory.Create(indexName: "bookstore-categories-cosmosdb-index");
        private readonly AzureSearchClientService _productSearchClientService = searchClientFactory.Create(indexName: "bookstore-products-cosmosdb-index");


        [Function("CFCategoryFunction")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "categories",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<Category> input)
        {
            if (input != null && input.Count > 0)
            {
                var categoryBatch = new IndexDocumentsBatch<SearchDocument>();
                var productBatch = new IndexDocumentsBatch<SearchDocument>();

                foreach (var updatedCategory in input)
                {
                    if (updatedCategory == null)
                        continue;

                    IEnumerable<Product>? updatedProducts = null;

                    // category is going to be deleted
                    if (updatedCategory.IsDeleted && updatedCategory.TTL == -1)
                    {
                        _logger.LogInformation($"[CFCategory] Deleting category id: {updatedCategory.Id}");

                        updatedProducts = await productRepository.ResetCategoryAsync(updatedCategory.CategoryId);

                        // perform a hard delete if you want
                        await categoryRepository.DeleteCategoryAsync(updatedCategory);

                        // call Delete if perform a hard delete
                        _categorySearchClientService.InsertToBatch(categoryBatch, updatedCategory, BatchAction.Delete);
                    }
                    // category updated
                    else if (!updatedCategory.IsDeleted)
                    {
                        if (updatedCategory.CreatedAt != updatedCategory.ModifiedAt)
                        {
                            _logger.LogInformation($"[CFCategory] Updating category id: {updatedCategory.Id}");
                            updatedProducts = await productRepository.UpdateCategoriesAsync(updatedCategory.CategoryId);

                            _categorySearchClientService.InsertToBatch(categoryBatch, updatedCategory, BatchAction.Merge);
                        }
                        else
                        {
                            _logger.LogInformation($"[CFCategory] Creating category id: {updatedCategory.Id}");

                            _categorySearchClientService.InsertToBatch(categoryBatch, updatedCategory, BatchAction.Upload);
                        }
                    }


                    if (updatedProducts != null)
                    {
                        foreach (var updatedProduct in updatedProducts)
                        {
                            _productSearchClientService.InsertToBatch(productBatch, updatedProduct, BatchAction.Merge);
                        }
                    }
                }

                await _categorySearchClientService.ExecuteBatchIndex(categoryBatch);
                _logger.LogInformation($"[CFCategory] Executed batch category, count: {categoryBatch.Actions.Count}");

                await _productSearchClientService.ExecuteBatchIndex(productBatch);
                _logger.LogInformation($"[CFCategory] Executed batch product, count: {productBatch.Actions.Count}");
            }
        }
    }
}
