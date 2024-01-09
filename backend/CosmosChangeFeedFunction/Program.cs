using Azure;
using Azure.Search.Documents.Indexes;
using CosmosChangeFeedFunction.Repositories;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddSingleton((s) => {

            CosmosClientOptions options = new()
            {
                ApplicationName = context.Configuration["DatabaseName"],
                ConnectionMode = ConnectionMode.Gateway
            };

            return new CosmosClient(context.Configuration["CosmosDbConnectionString"], options);
        });

        services.AddTransient<AzureSearchClientFactory>();

        services.AddTransient<IProductRepository, ProductRepository>();
        services.AddTransient<ICategoryRepository, CategoryRepository>();
        services.AddTransient<IInventoryRepository, InventoryRepository>();
        services.AddTransient<IPurchaseOrderRepository, PurchaseOrderRepository>();
        services.AddTransient<IActivityLogRepository, ActivityLogRepository>();
        services.AddTransient<ISupplierRepository, SupplierRepository>();
        services.AddTransient<ISupplierGroupRepository, SupplierGroupRepository>();
        services.AddTransient<IStaffRepository, StaffRepository>();
        services.AddTransient<ICustomerRepository, CustomerRepository>();
    })
    .Build();

host.Run();
