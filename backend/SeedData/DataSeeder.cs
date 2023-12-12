using Newtonsoft.Json;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Repository;

namespace SE100_BookstoreWebAPI.SeedData
{
    public class DataSeeder
    {
        private readonly string _categoriesFilePath = "./SeedData/SampleData/categories.json";
        private readonly string _inventoryFilePath = "./SeedData/SampleData/inventory.json";
        private readonly string _productsFilePath = "./SeedData/SampleData/products.json";
        private readonly string _salesOrdersFilePath = "./SeedData/SampleData/salesOrders.json";
        private readonly string _purchaseOrdersFilePath = "./SeedData/SampleData/purchaseOrders.json";
        private readonly string _suppliersFilePath = "./SeedData/SampleData/suppliers.json";


        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;
        private readonly ISupplierRepository _supplierRepository;
        private readonly ILogger _logger;

        public DataSeeder(
            IProductRepository productRepository, 
            ICategoryRepository categoryRepository, 
            ISalesOrderRepository salesOrderRepository,
            IPurchaseOrderRepository purchaseOrderRepository,
            ISupplierRepository supplierRepository,

            ILogger<DataSeeder> logger)
        {
            this._productRepository = productRepository;
            this._categoryRepository = categoryRepository;
            this._salesOrderRepository = salesOrderRepository;
            this._purchaseOrderRepository = purchaseOrderRepository;
            this._supplierRepository = supplierRepository;
            this._logger = logger;
        }


        public async Task SeedDataAsync()
        {
            var categoriesJsonData = File.ReadAllText(_categoriesFilePath);
            var inventoryJsonData = File.ReadAllText(_inventoryFilePath);
            var productsJsonData = File.ReadAllText(_productsFilePath);
            var salesOrdersJsonData = File.ReadAllText(_salesOrdersFilePath);
            var purchaseOrdersJsonData = File.ReadAllText(_purchaseOrdersFilePath);
            var suppliersJsonData = File.ReadAllText(_suppliersFilePath);

            // Seed Carts
            var categoryItems = JsonConvert.DeserializeObject<List<CategoryDocument>>(categoriesJsonData);

            if (categoryItems != null)
            {
                foreach (var item in categoryItems)
                {
                    await _categoryRepository.AddCategoryAsync(item);
                }

                _logger.LogInformation("Populated cart data");
            }

            // Seed customers
            var inventoryItems = JsonConvert.DeserializeObject<List<InventoryDocument>>(inventoryJsonData);

            if (inventoryItems != null)
            {
                foreach (var item in inventoryItems)
                {
                    await _productRepository.AddInventoryAsync(item);
                }

                _logger.LogInformation("Populated customer data");
            }

            // Seed products
            var productsItems = JsonConvert.DeserializeObject<List<ProductDocument>>(productsJsonData);

            if (productsItems != null)
            {
                foreach (var item in productsItems)
                {
                    await _productRepository.AddProductAsync(item);
                }

                _logger.LogInformation("Populated product data");
            }

            // Seed orders
            var salesOrdersItems = JsonConvert.DeserializeObject<List<SalesOrderDocument>>(salesOrdersJsonData);

            if (salesOrdersItems != null)
            {
                foreach (var item in salesOrdersItems)
                {
                    await _salesOrderRepository.AddSalesOrderAsync(item);
                }

                _logger.LogInformation("Populated order data");
            }

            // Seed categories
            var purchaseOrderItems = JsonConvert.DeserializeObject<List<PurchaseOrderDocument>>(purchaseOrdersJsonData);

            if (purchaseOrderItems != null)
            {
                foreach (var item in purchaseOrderItems)
                {
                    await _purchaseOrderRepository.AddPurchaseOrderAsync(item);
                }

                _logger.LogInformation("Populated category data");
            }

            // Seed staffs
            var suppliersItems = JsonConvert.DeserializeObject<List<SupplierDocument>>(suppliersJsonData);

            if (suppliersItems != null)
            {
                foreach (var item in suppliersItems)
                {
                    await _supplierRepository.AddSupplierAsync(item);
                }

                _logger.LogInformation("Populated staff data");
            }
        }
    }

}
