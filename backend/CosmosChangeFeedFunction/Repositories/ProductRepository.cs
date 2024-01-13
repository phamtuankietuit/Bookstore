using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly ISupplierRepository _supplierRepository;
        private readonly ILogger _logger;
        private Container _productContainer;
        private Container _inventoryContainer;

        public ProductRepository(
            CosmosClient cosmosClient,
            ICategoryRepository categoryRepository,
            ILoggerFactory loggerFactory,
            ISupplierRepository supplierRepository)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _productContainer = cosmosClient.GetContainer(databaseName, "products");
            _inventoryContainer = cosmosClient.GetContainer(databaseName, "inventories");
            
            _categoryRepository = categoryRepository;
            _supplierRepository = supplierRepository;
            
            _logger = loggerFactory.CreateLogger<ProductRepository>();
        }

        public async Task<IEnumerable<Product>?> ResetCategoryAsync(string categoryId)
        {
            return await UpdateCategoriesAsync("cate00000");
        }

        public async Task<IEnumerable<Product>?> ResetSuppliersAsync(string supplierId)
        {
            return await UpdateSuppliersAsync("sup00000");
        }

        public async Task<IEnumerable<Product>?> UpdateCategoriesAsync(string categoryId)
        {
            var productDocsBelongToCategory = await GetProductsInCategoryAsync(categoryId);

            if (productDocsBelongToCategory == null || !productDocsBelongToCategory.Any())
            {
                _logger.LogError($"No product belongs to category {categoryId}");
                return null;
            }

            var CategoryToUpdate = await _categoryRepository.GetCategoryByIdAsync(categoryId);

            if (CategoryToUpdate == null)
            {
                _logger.LogError($"Category is null when collect to update product, id {categoryId}");
                return null;
            }


            foreach (var productDoc in productDocsBelongToCategory)
            {
                productDoc.CategoryId = CategoryToUpdate.Id;
                productDoc.CategoryName = CategoryToUpdate.Name;
                productDoc.CategoryText = CategoryToUpdate.Text;

                List<PatchOperation> operations =
                [
                    PatchOperation.Replace("/categoryId", CategoryToUpdate.Id),
                    PatchOperation.Replace("/categoryName", CategoryToUpdate.Name),
                    PatchOperation.Replace("/categoryText", CategoryToUpdate.Text),
                    PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
                ];

                await _productContainer.PatchItemAsync<Product>(productDoc.Id, new PartitionKey(productDoc.Sku), operations);
                _logger.LogInformation($"[ProductRepository] Updated Product Category, prodid: {productDoc.Id}");
            }

            return productDocsBelongToCategory;
        }

        public async Task<IEnumerable<Product>?> UpdateSuppliersAsync(string supplierId)
        {
            var productDocsBelongToSupplier = await GetProductsBelongsToSupplierAsync(supplierId);

            if (productDocsBelongToSupplier == null)
            {
                _logger.LogError($"No product belongs to supplier {supplierId}");
                return null;
            }

            var supplierDoc = await _supplierRepository.GetSupplierByIdAsync(supplierId);

            if (supplierDoc == null)
            {
                _logger.LogError($"Supplier is null when collect to update product, id {supplierId}");
                return null;
            }


            foreach (var productDoc in productDocsBelongToSupplier)
            {
                productDoc.SupplierId = supplierDoc.Id;
                productDoc.SupplierName = supplierDoc.Name;

                List<PatchOperation> operations =
                [
                    PatchOperation.Replace("/supplierId", supplierDoc.Id),
                    PatchOperation.Replace("/supplierName", supplierDoc.Name),
                    PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
                ];

                await _productContainer.PatchItemAsync<Product>(productDoc.Id, new PartitionKey(productDoc.Sku), operations);

                _logger.LogInformation($"[ProductRepository] Updated Product Supplier, prodid: {productDoc.Id}");
            }

            return productDocsBelongToSupplier;
        }

        private async Task<IEnumerable<Product>?> GetProductsInCategoryAsync(string categoryId)
        {
            var queryDef = new QueryDefinition(
                query:
                "SELECT * " +
                "FROM p " +
                "WHERE p.categoryId = @categoryId"
            ).WithParameter("@categoryId", categoryId);

            var results = await CosmosDbUtils.GetDocumentsByQueryDefinition<Product>(_productContainer, queryDef);

            return results;
        }

        private async Task<IEnumerable<Product>?> GetProductsBelongsToSupplierAsync(string supplierId)
        {
            var queryDef = new QueryDefinition(
                query:
                "SELECT * " +
                "FROM p " +
                "WHERE p.supplierId = @supplierId"
            ).WithParameter("@supplierId", supplierId);

            var results = await CosmosDbUtils.GetDocumentsByQueryDefinition<Product>(_productContainer, queryDef);

            return results;
        }
    }
}
