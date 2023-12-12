using Microsoft.Azure.Cosmos;
using SE100_BookstoreWebAPI.Repository;
using SE100_BookstoreWebAPI.SeedData;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();


var configuration = builder.Configuration;

// Add services to the container.

builder.Services.AddSingleton((provider) =>
{
    var endpointUri = configuration["CosmosDbSettings:EndpointUri"];
    var primaryKey = configuration["CosmosDbSettings:PrimaryKey"];
    var databaseName = configuration["CosmosDbSettings:DatabaseName"];

    var cosmosClientOptions = new CosmosClientOptions
    {
        ApplicationName = databaseName,
        ConnectionMode = ConnectionMode.Gateway
    };

    LoggerFactory.Create(builder =>
    {
        builder.AddConsole();
    });

    return new CosmosClient(endpointUri, primaryKey, cosmosClientOptions);  
});



builder.Services.AddTransient<IProductRepository, ProductRepository>();
builder.Services.AddTransient<ICategoryRepository, CategoryRepository>();
builder.Services.AddTransient<ISupplierRepository, SupplierRepository>();
builder.Services.AddTransient<ISalesOrderRepository, SalesOrderRepository>();
builder.Services.AddTransient<IPurchaseOrderRepository, PurchaseOrderRepository>();
builder.Services.AddTransient<DataSeeder>();
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed data if database is successfully created
var scopeFactory = app.Services.GetRequiredService<IServiceScopeFactory>();
using (var scope = scopeFactory.CreateScope())
{
    // Create instance of CosmosClient
    var cosmosClient = scope.ServiceProvider.GetRequiredService<CosmosClient>();

    // Get the Database Name
    var databaseName = cosmosClient.ClientOptions.ApplicationName;

    // Autoscale throughput settings
    ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.CreateAutoscaleThroughput(1000);

    //Create the database with autoscale enabled
    var response = await cosmosClient.CreateDatabaseIfNotExistsAsync(databaseName, throughputProperties: autoscaleThroughputProperties);

    // Logging
    if (response.StatusCode == HttpStatusCode.Created)
        app.Logger.LogInformation($"Database {databaseName} created");
    else
        app.Logger.LogInformation($"Database {databaseName} had already created before");

    // Get the database
    var database = cosmosClient.GetDatabase(databaseName);


    if (database != null)
    {
        bool emptyContainerCreated = await EnsureContainersAreCreatedAsync(database);

        if (emptyContainerCreated)
        {
            var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();

            await seeder.SeedDataAsync();
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();


async Task<bool> EnsureContainersAreCreatedAsync(Database database)
{
    var containersToCreate = new[]
    {
        ("categories", "/categoryId"),
        ("products", "/sku"),
        ("inventory", "/sku"),
        ("suppliers", "/supplierId"),
        ("salesOrders", "/monthYear"),
        ("purchaseOrders", "/monthYear")
    };

    foreach (var (containerName, partitionKeyPath) in containersToCreate)
    {
        var statusCode = await GetContainerCreationStatusCode(database, containerName, partitionKeyPath);

        if (statusCode != HttpStatusCode.Created)
        {
            return false;
        }
    }

    return true;
}

async Task<HttpStatusCode> GetContainerCreationStatusCode(Database database, string containerName, string partitionKeyPath)
{
    var response = await database.CreateContainerIfNotExistsAsync(containerName, partitionKeyPath);

    if (response.StatusCode == HttpStatusCode.Created)
        app.Logger.LogInformation($"Container {containerName} created");
    else
        app.Logger.LogInformation($"Container {containerName} had already created before");

    return response.StatusCode;
}
