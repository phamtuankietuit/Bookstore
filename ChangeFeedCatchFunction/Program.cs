using Azure.Core;
using ChangeFeedCatchFunction.Repositories;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureAppConfiguration((context, config) =>
    {
        config.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true);
    })
    .ConfigureServices((context, services) =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddSingleton((s) => {

            CosmosClientOptions options = new CosmosClientOptions()
            {
                ApplicationName = context.Configuration.GetValue<string>("DatabaseName"),
                ConnectionMode = ConnectionMode.Gateway
            };

            return new CosmosClient(context.Configuration.GetValue<string>("CosmosDbConnectionString"), options);
        });
        services.AddTransient<IProductRepository, ProductRepository>();
        services.AddTransient<ICategoryRepository, CategoryRepository>();
    })
    .Build();

host.Run();
