using Newtonsoft.Json;
using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Repository.Interfaces;

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
        private readonly string _promotionsFilePath = "./SeedData/SampleData/promotions.json";
        private readonly string _customersFilePath = "./SeedData/SampleData/customers.json";


        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IPromotionRepository _promotionRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ILogger _logger;

        public DataSeeder(
            IProductRepository productRepository, 
            ICategoryRepository categoryRepository, 
            ISalesOrderRepository salesOrderRepository,
            IPurchaseOrderRepository purchaseOrderRepository,
            ISupplierRepository supplierRepository,
            IPromotionRepository promotionRepository,
            ICustomerRepository customerRepository,
            ILogger<DataSeeder> logger)
        {
            this._productRepository = productRepository;
            this._categoryRepository = categoryRepository;
            this._salesOrderRepository = salesOrderRepository;
            this._purchaseOrderRepository = purchaseOrderRepository;
            this._supplierRepository = supplierRepository;
            this._promotionRepository = promotionRepository;
            this._customerRepository = customerRepository;
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
            var promotionsJsonData = File.ReadAllText(_promotionsFilePath);
            var customersJsonData = File.ReadAllText(_customersFilePath);



            // Seed Carts
            var categoryItems = JsonConvert.DeserializeObject<List<CategoryDocument>>(categoriesJsonData);

            if (categoryItems != null)
            {
                foreach (var item in categoryItems)
                {
                    await _categoryRepository.AddCategoryDocumentAsync(item);
                }

                _logger.LogInformation("Populated cart data");
            }

            // Seed customers
            var inventoryItems = JsonConvert.DeserializeObject<List<InventoryDocument>>(inventoryJsonData);

            if (inventoryItems != null)
            {
                foreach (var item in inventoryItems)
                {
                    await _productRepository.AddInventoryDocumentAsync(item);
                }

                _logger.LogInformation("Populated customer data");
            }

            // Seed products
            var productsItems = JsonConvert.DeserializeObject<List<ProductDocument>>(productsJsonData);

            if (productsItems != null)
            {
                foreach (var item in productsItems)
                {
                    await _productRepository.AddProductDocumentAsync(item);
                }

                _logger.LogInformation("Populated product data");
            }

            // Seed orders
            var salesOrdersItems = JsonConvert.DeserializeObject<List<SalesOrderDocument>>(salesOrdersJsonData);

            if (salesOrdersItems != null)
            {
                foreach (var item in salesOrdersItems)
                {
                    await _salesOrderRepository.AddSalesOrderDocumentAsync(item);
                }

                _logger.LogInformation("Populated order data");
            }

            // Seed categories
            var purchaseOrderItems = JsonConvert.DeserializeObject<List<PurchaseOrderDocument>>(purchaseOrdersJsonData);

            if (purchaseOrderItems != null)
            {
                foreach (var item in purchaseOrderItems)
                {
                    await _purchaseOrderRepository.AddPurchaseOrderDocumentAsync(item);
                }

                _logger.LogInformation("Populated category data");
            }

            // Seed staffs
            var suppliersItems = JsonConvert.DeserializeObject<List<SupplierDocument>>(suppliersJsonData);

            if (suppliersItems != null)
            {
                foreach (var item in suppliersItems)
                {
                    await _supplierRepository.AddSupplierDocumentAsync(item);
                }

                _logger.LogInformation("Populated staff data");
            }


            // Seed promotions
            var PromotionItems = JsonConvert.DeserializeObject<List<PromotionDocument>>(promotionsJsonData);

            if (PromotionItems != null)
            {
                foreach (var item in PromotionItems)
                {
                    await _promotionRepository.AddPromotionDocumentAsync(item);
                }

                _logger.LogInformation("Populated promotion data");
            }


            // Seed customers
            var customerItems = JsonConvert.DeserializeObject<List<CustomerDocument>>(customersJsonData);

            if (customerItems != null)
            {
                foreach (var item in customerItems)
                {
                    await _customerRepository.AddCustomerDocumentAsync(item);
                }

                _logger.LogInformation("Populated customer data");
            }
        }
    }

}
