using Newtonsoft.Json;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Repository.Interfaces;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.SeedData
{
    public class DataSeeder
    {
        private readonly string _activityLogsFilePath = "./SeedData/SampleData/activityLogs.json";
        private readonly string _adjustmentTicketsFilePath = "./SeedData/SampleData/adjustmentTickets.json";
        private readonly string _adjustmentItemsFilePath = "./SeedData/SampleData/adjustmentItems.json";
        private readonly string _categoriesFilePath = "./SeedData/SampleData/categories.json";
        private readonly string _inventoryFilePath = "./SeedData/SampleData/inventory.json";
        private readonly string _productsFilePath = "./SeedData/SampleData/products.json";
        private readonly string _salesOrdersFilePath = "./SeedData/SampleData/salesOrders.json";
        private readonly string _purchaseOrdersFilePath = "./SeedData/SampleData/purchaseOrders.json";
        private readonly string _returnOrdersFilePath = "./SeedData/SampleData/returnOrders.json";
        private readonly string _suppliersFilePath = "./SeedData/SampleData/suppliers.json";
        private readonly string _supplierGroupsFilePath = "./SeedData/SampleData/supplierGroups.json";
        private readonly string _promotionsFilePath = "./SeedData/SampleData/promotions.json";
        private readonly string _customersFilePath = "./SeedData/SampleData/customers.json";
        private readonly string _staffsFilePath = "./SeedData/SampleData/staffs.json";


        private readonly ILogger _logger;


        private readonly Container _productContainer;
        private readonly Container _activityLogContainer;
        private readonly Container _adjustmentTicketContainer;
        private readonly Container _adjustmentItemContainer;
        private readonly Container _inventoryContainer;
        private readonly Container _categoryContainer;
        private readonly Container _salesOrderContainer;
        private readonly Container _purchaseOrderContainer;
        private readonly Container _returnOrderContainer;
        private readonly Container _supplierContainer;
        private readonly Container _promotionContainer;
        private readonly Container _customerContainer;
        private readonly Container _supplierGroupContainer;
        private readonly Container _staffContainer;

        public DataSeeder(
            CosmosClient cosmosClient,
            ILogger<DataSeeder> logger)
        {
            _logger = logger;


            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _productContainer = cosmosClient.GetContainer(databaseName, "products");
            _inventoryContainer = cosmosClient.GetContainer(databaseName, "inventories");
            _categoryContainer = cosmosClient.GetContainer(databaseName, "categories");
            _salesOrderContainer = cosmosClient.GetContainer(databaseName, "salesOrders");
            _purchaseOrderContainer = cosmosClient.GetContainer(databaseName, "purchaseOrders");
            _returnOrderContainer = cosmosClient.GetContainer(databaseName, "returnOrders");
            _supplierContainer = cosmosClient.GetContainer(databaseName, "suppliers");
            _promotionContainer = cosmosClient.GetContainer(databaseName, "promotions");
            _customerContainer = cosmosClient.GetContainer(databaseName, "customers");
            _supplierGroupContainer = cosmosClient.GetContainer(databaseName, "supplierGroups");
            _staffContainer = cosmosClient.GetContainer(databaseName, "staffs");
            _activityLogContainer = cosmosClient.GetContainer(databaseName, "activityLogs");
            _adjustmentTicketContainer = cosmosClient.GetContainer(databaseName, "adjustmentTickets");
            _adjustmentItemContainer = cosmosClient.GetContainer(databaseName, "adjustmentItems");
        }


        public async Task SeedDataAsync()
        {
            var activityLogsJsonData = File.ReadAllText(_activityLogsFilePath);
            var adjustmentTicketsJsonData = File.ReadAllText(_adjustmentTicketsFilePath);
            var adjustmentItemsJsonData = File.ReadAllText(_adjustmentItemsFilePath);
            var categoriesJsonData = File.ReadAllText(_categoriesFilePath);
            var inventoryJsonData = File.ReadAllText(_inventoryFilePath);
            var productsJsonData = File.ReadAllText(_productsFilePath);
            var salesOrdersJsonData = File.ReadAllText(_salesOrdersFilePath);
            var purchaseOrdersJsonData = File.ReadAllText(_purchaseOrdersFilePath);
            var returnOrdersJsonData = File.ReadAllText(_returnOrdersFilePath);
            var suppliersJsonData = File.ReadAllText(_suppliersFilePath);
            var supplierGroupsJsonData = File.ReadAllText(_supplierGroupsFilePath);
            var promotionsJsonData = File.ReadAllText(_promotionsFilePath);
            var customersJsonData = File.ReadAllText(_customersFilePath);
            var staffsJsonData = File.ReadAllText(_staffsFilePath);


            // Seed Carts
            var activityLogItems = JsonConvert.DeserializeObject<List<ActivityLogDocument>>(activityLogsJsonData);

            if (activityLogItems != null)
            {
                foreach (var item in activityLogItems)
                {
                    //await _activityLogRepository.AddActivityLogDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt ??= item.CreatedAt;

                    await _activityLogContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.StaffId)
                    );
                }

                _logger.LogInformation("Populated activityLog data");
            }

            // Seed Carts
            var adjustmentTicketItems = JsonConvert.DeserializeObject<List<AdjustmentTicketDocument>>(adjustmentTicketsJsonData);

            if (adjustmentTicketItems != null)
            {
                foreach (var item in adjustmentTicketItems)
                {
                    //await _adjustmentTicketRepository.AddActivityLogDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt ??= item.CreatedAt;

                    await _adjustmentTicketContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.AdjustmentTicketId)
                    );
                }

                _logger.LogInformation("Populated adjustmentTicket data");
            }

            // Seed Carts
            var adjustmentItemItems = JsonConvert.DeserializeObject<List<AdjustmentItemDocument>>(adjustmentItemsJsonData);

            if (adjustmentItemItems != null)
            {
                foreach (var item in adjustmentItemItems)
                {
                    //await _activityLogRepository.AddActivityLogDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt ??= item.CreatedAt;

                    await _adjustmentItemContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.AdjustmentTicketId)
                    );
                }

                _logger.LogInformation("Populated adjustmentItemItems data");
            }

            // Seed Carts
            var categoryItems = JsonConvert.DeserializeObject<List<CategoryDocument>>(categoriesJsonData);

            if (categoryItems != null)
            {
                foreach (var item in categoryItems)
                {
                    //await _categoryRepository.AddCategoryDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt ??= item.CreatedAt;

                    await _categoryContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.CategoryId)
                    );
                }

                _logger.LogInformation("Populated category data");
            }

            // Seed customers
            var inventoryItems = JsonConvert.DeserializeObject<List<InventoryDocument>>(inventoryJsonData);

            if (inventoryItems != null)
            {
                foreach (var item in inventoryItems)
                {
                    //await _productRepository.AddInventoryDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt = item.CreatedAt;

                    await _inventoryContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.Sku)
                    );
                }

                _logger.LogInformation("Populated inventory data");
            }

            // Seed products
            var productsItems = JsonConvert.DeserializeObject<List<ProductDocument>>(productsJsonData);

            if (productsItems != null)
            {
                foreach (var item in productsItems)
                {
                    //await _productRepository.AddProductDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt ??= item.CreatedAt;

                    await _productContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.Sku)
                    );
                }

                _logger.LogInformation("Populated product data");
            }

            // Seed orders
            var salesOrdersItems = JsonConvert.DeserializeObject<List<SalesOrderDocument>>(salesOrdersJsonData);

            if (salesOrdersItems != null)
            {
                foreach (var item in salesOrdersItems)
                {
                    //await _salesOrderRepository.AddSalesOrderDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.MonthYear = item.CreatedAt.Value.ToString("yyyy-MM");
                    item.ReturnDate = item.CreatedAt.Value.AddDays(5);
                    item.ModifiedAt = item.CreatedAt;

                    await _salesOrderContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.MonthYear)
                    );
                }
                _logger.LogInformation("Populated sales order data");
            }

            // Seed categories
            var purchaseOrderItems = JsonConvert.DeserializeObject<List<PurchaseOrderDocument>>(purchaseOrdersJsonData);

            if (purchaseOrderItems != null)
            {
                foreach (var item in purchaseOrderItems)
                {
                    //await _purchaseOrderRepository.AddPurchaseOrderDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.MonthYear = item.CreatedAt.Value.ToString("yyyy-MM");
                    item.ModifiedAt = item.CreatedAt;

                    await _purchaseOrderContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.MonthYear)
                    );
                }

                _logger.LogInformation("Populated purchase order data");
            }

            // Seed categories
            var returnOrderItems = JsonConvert.DeserializeObject<List<ReturnOrderDocument>>(returnOrdersJsonData);

            if (returnOrderItems != null)
            {
                foreach (var item in returnOrderItems)
                {
                    //await _returnOrderRepository.AddReturnOrderDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt = item.CreatedAt;

                    await _returnOrderContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.SalesOrderId)
                    );
                }

                _logger.LogInformation("Populated return order data");
            }

            // Seed staffs
            var suppliersItems = JsonConvert.DeserializeObject<List<SupplierDocument>>(suppliersJsonData);

            if (suppliersItems != null)
            {
                foreach (var item in suppliersItems)
                {
                    //await _supplierRepository.AddSupplierDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt = item.CreatedAt;

                    await _supplierContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.SupplierId)
                    );
                }

                _logger.LogInformation("Populated supplier data");
            }

            var supplierGroupsItems = JsonConvert.DeserializeObject<List<SupplierGroupDocument>>(supplierGroupsJsonData);

            if (supplierGroupsItems != null)
            {
                foreach (var item in supplierGroupsItems)
                {
                    //await _supplierGroupRepository.AddSupplierGroupDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt = item.CreatedAt;

                    await _supplierGroupContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.SupplierGroupId)
                    );
                }

                _logger.LogInformation("Populated supplier group data");
            }


            // Seed promotions
            var PromotionItems = JsonConvert.DeserializeObject<List<PromotionDocument>>(promotionsJsonData);

            if (PromotionItems != null)
            {
                foreach (var item in PromotionItems)
                {
                    //await _promotionRepository.AddPromotionDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt ??= item.CreatedAt;

                    await _promotionContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.PromotionId)
                    );
                }

                _logger.LogInformation("Populated promotion data");
            }


            // Seed customers
            var customerItems = JsonConvert.DeserializeObject<List<CustomerDocument>>(customersJsonData);

            if (customerItems != null)
            {
                foreach (var item in customerItems)
                {
                    //await _customerRepository.AddCustomerDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt = item.CreatedAt;


                    await _customerContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.CustomerId)
                    );
                }

                _logger.LogInformation("Populated customer data");
            }

            // Seed customers
            var staffItems = JsonConvert.DeserializeObject<List<StaffDocument>>(staffsJsonData);

            if (staffItems != null)
            {
                foreach (var item in staffItems)
                {
                    //await _staffRepository.AddStaffDocumentAsync(item);

                    item.CreatedAt ??= DateTime.UtcNow;
                    item.ModifiedAt = item.CreatedAt;

                    await _staffContainer.UpsertItemAsync(
                        item: item,
                        partitionKey: new PartitionKey(item.StaffId)
                    );
                }

                _logger.LogInformation("Populated staff data");
            }
        }
    }

}
