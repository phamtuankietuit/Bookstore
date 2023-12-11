using Azure.Core;
using Microsoft.Azure.Cosmos;
using SE100_BookstoreWebAPI.Models.BindingModels;
using SE100_BookstoreWebAPI.Models.Documents;

namespace SE100_BookstoreWebAPI.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ILogger<CategoryRepository> _logger;
        private readonly Container _productContainer;
        private readonly Container _inventoryContainer;

        public ProductRepository(CosmosClient cosmosClient, ILogger<CategoryRepository> logger)
        {
            this._logger = logger;

            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "products";

            _productContainer = cosmosClient.GetContainer(databaseName, containerName); 
            _inventoryContainer = cosmosClient.GetContainer(databaseName, "inventory");
        }

        public async Task AddInventoryAsync(InventoryDocument item)
        {
            await _inventoryContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.Sku)
            );
        }

        public async Task AddProductAsync(ProductDocument item)
        {
            await _productContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.Sku)
            );
        }

        public async Task<IEnumerable<ProductDocument>> GetAllProductsInCategoryAsync(string categoryName)
        {
            // Create a SQL-like query to search for products with matching categoryPath
            var query = new QueryDefinition(
                query: "SELECT * FROM products p WHERE CONTAINS(p.categoryName, @categoryName)"
            ).WithParameter("@categoryName", categoryName);

            var results = new List<ProductDocument>();

            using var feed = _productContainer.GetItemQueryIterator<ProductDocument>(
                queryDefinition: query
            );

            double requestCharge = 0d;

            while (feed.HasMoreResults)
            {
                var response = await feed.ReadNextAsync();
                requestCharge += response.RequestCharge;

                results.AddRange(response);
            }


            // Logging the request charge
            _logger.LogInformation($"category name: {categoryName} \nrequest charged: {requestCharge}");

            return results;
        }


        public async Task<ProductDocument?> GetProductBySkuAsync(string sku)
        {
            var query = new QueryDefinition(
                query: "SELECT * FROM products p WHERE p.sku = @sku"
            ).WithParameter("@sku", sku);

            using var feed = _productContainer.GetItemQueryIterator<ProductDocument>(
                queryDefinition: query
            );

            double requestCharge = 0d;
            FeedResponse<ProductDocument> response = await feed.ReadNextAsync();
            requestCharge += response.RequestCharge;
            
            // Logging the request charge
            _logger.LogInformation($"sku: {sku} \nrequest charged: {requestCharge}");

            return response.FirstOrDefault();
        }
    }
}
