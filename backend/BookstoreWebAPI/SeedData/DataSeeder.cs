using Newtonsoft.Json;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Repository.Interfaces;

namespace BookstoreWebAPI.SeedData
{
    public class DataSeeder
    {
        private readonly string _categoriesFilePath = "./SeedData/SampleData/categories.json";
        private readonly string _inventoryFilePath = "./SeedData/SampleData/inventory.json";
        private readonly string _productsFilePath = "./SeedData/SampleData/products.json";
        private readonly string _salesOrdersFilePath = "./SeedData/SampleData/salesOrders.json";
        private readonly string _purchaseOrdersFilePath = "./SeedData/SampleData/purchaseOrders.json";
        private readonly string _suppliersFilePath = "./SeedData/SampleData/suppliers.json";
        private readonly string _supplierGroupsFilePath = "./SeedData/SampleData/supplierGroups.json";
        private readonly string _promotionsFilePath = "./SeedData/SampleData/promotions.json";
        private readonly string _customersFilePath = "./SeedData/SampleData/customers.json";
        private readonly string _staffsFilePath = "./SeedData/SampleData/staffs.json";

        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IPromotionRepository _promotionRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ISupplierGroupRepository _supplierGroupRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly ILogger _logger;

        public DataSeeder(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            ISalesOrderRepository salesOrderRepository,
            IPurchaseOrderRepository purchaseOrderRepository,
            ISupplierRepository supplierRepository,
            IPromotionRepository promotionRepository,
            ICustomerRepository customerRepository,
            ISupplierGroupRepository supplierGroupRepository,
            IStaffRepository staffRepository,
            ILogger<DataSeeder> logger)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _salesOrderRepository = salesOrderRepository;
            _purchaseOrderRepository = purchaseOrderRepository;
            _supplierRepository = supplierRepository;
            _promotionRepository = promotionRepository;
            _customerRepository = customerRepository;
            _supplierGroupRepository = supplierGroupRepository;
            _staffRepository = staffRepository;
            _logger = logger;
        }


        public async Task SeedDataAsync()
        {
            var categoriesJsonData = File.ReadAllText(_categoriesFilePath);
            var inventoryJsonData = File.ReadAllText(_inventoryFilePath);
            var productsJsonData = File.ReadAllText(_productsFilePath);
            var salesOrdersJsonData = File.ReadAllText(_salesOrdersFilePath);
            var purchaseOrdersJsonData = File.ReadAllText(_purchaseOrdersFilePath);
            var suppliersJsonData = File.ReadAllText(_suppliersFilePath);
            var supplierGroupsJsonData = File.ReadAllText(_supplierGroupsFilePath);
            var promotionsJsonData = File.ReadAllText(_promotionsFilePath);
            var customersJsonData = File.ReadAllText(_customersFilePath);
            var staffsJsonData = File.ReadAllText(_staffsFilePath);



            // Seed Carts
            var categoryItems = JsonConvert.DeserializeObject<List<CategoryDocument>>(categoriesJsonData);

            if (categoryItems != null)
            {
                foreach (var item in categoryItems)
                {
                    await _categoryRepository.AddCategoryDocumentAsync(item);
                }

                _logger.LogInformation("Populated category data");
            }

            // Seed customers
            var inventoryItems = JsonConvert.DeserializeObject<List<InventoryDocument>>(inventoryJsonData);

            if (inventoryItems != null)
            {
                foreach (var item in inventoryItems)
                {
                    await _productRepository.AddInventoryDocumentAsync(item);
                }

                _logger.LogInformation("Populated inventory data");
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
                _logger.LogInformation("Populated sales order data");
            }

            // Seed categories
            var purchaseOrderItems = JsonConvert.DeserializeObject<List<PurchaseOrderDocument>>(purchaseOrdersJsonData);

            if (purchaseOrderItems != null)
            {
                foreach (var item in purchaseOrderItems)
                {
                    await _purchaseOrderRepository.AddPurchaseOrderDocumentAsync(item);
                }

                _logger.LogInformation("Populated purchase order data");
            }

            // Seed staffs
            var suppliersItems = JsonConvert.DeserializeObject<List<SupplierDocument>>(suppliersJsonData);

            if (suppliersItems != null)
            {
                foreach (var item in suppliersItems)
                {
                    await _supplierRepository.AddSupplierDocumentAsync(item);
                }

                _logger.LogInformation("Populated supplier data");
            }

            var supplierGroupsItems = JsonConvert.DeserializeObject<List<SupplierGroupDocument>>(supplierGroupsJsonData);

            if (supplierGroupsItems != null)
            {
                foreach (var item in supplierGroupsItems)
                {
                    await _supplierGroupRepository.AddSupplierGroupDocumentAsync(item);
                }

                _logger.LogInformation("Populated supplier group data");
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

            // Seed customers
            var staffItems = JsonConvert.DeserializeObject<List<StaffDocument>>(staffsJsonData);

            if (staffItems != null)
            {
                foreach (var item in staffItems)
                {
                    await _staffRepository.AddStaffDocumentAsync(item);
                }

                _logger.LogInformation("Populated staff data");
            }
        }
    }

}
