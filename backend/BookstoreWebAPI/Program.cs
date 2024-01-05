using Microsoft.Azure.Cosmos;
using BookstoreWebAPI.Repository;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.SeedData;
using BookstoreWebAPI.Utils;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using static System.Net.Mime.MediaTypeNames;
using FluentValidation;
using BookstoreWebAPI.Validators;
using BookstoreWebAPI.Models.BindingModels;
using Azure.Storage.Blobs;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Services;
using Azure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BookstoreWebAPI.Models.Emails;
using BookstoreWebAPI.Validators.FilterModels;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddMemoryCache();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddControllersWithViews(options =>
{
    options.SuppressAsyncSuffixInActionNames = false;
});
builder.Services
    .AddAuthentication(options => {
        options.DefaultAuthenticateScheme =
                    JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(o => {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidAudience = builder.Configuration["JwtSecurityToken:Audience"]!,
            ValidIssuer = builder.Configuration["JwtSecurityToken:Issuer"]!,
            IssuerSigningKey = new SymmetricSecurityKey
            (Encoding.UTF8.GetBytes(builder.Configuration["JwtSecurityToken:Key"]!)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Add services to the container.
var configuration = builder.Configuration;
builder.Services.AddSingleton((provider) =>
{
    var endpointUri = configuration["CosmosDbSettings:EndpointUri"];
    var primaryKey = configuration["CosmosDbSettings:PrimaryKey"];
    var databaseName = configuration["CosmosDbSettings:DatabaseName"];

    var cosmosClientOptions = new CosmosClientOptions
    {
        ApplicationName = databaseName,
        ConnectionMode = ConnectionMode.Direct
    };

    LoggerFactory.Create(builder =>
    {
        builder.AddConsole();
    });

    return new CosmosClient(endpointUri, primaryKey, cosmosClientOptions);  
});

builder.Services.AddScoped(_ => {
    //var accountUri = new Uri(!);
    return new BlobServiceClient(configuration.GetConnectionString("AzureBlobStorage"));
});

var emailConfig = builder.Configuration
        .GetSection("EmailConfiguration")
        .Get<EmailConfiguration>();
builder.Services.AddSingleton(emailConfig);

// enable policy8
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin() // or AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin();
    });
});

// adding custom services
builder.Services.AddTransient<IFileService, FileService>();
builder.Services.AddTransient<IEmailSender, EmailSender>();

// adding utils
builder.Services.AddTransient<EmailUtils>();

// adding repositories
builder.Services.AddTransient<IProductRepository, ProductRepository>();
builder.Services.AddTransient<ICategoryRepository, CategoryRepository>();
builder.Services.AddTransient<ISupplierRepository, SupplierRepository>();
builder.Services.AddTransient<ISalesOrderRepository, SalesOrderRepository>();
builder.Services.AddTransient<IPurchaseOrderRepository, PurchaseOrderRepository>();
builder.Services.AddTransient<IPromotionRepository, PromotionRepository>();
builder.Services.AddTransient<ICustomerRepository, CustomerRepository>();
builder.Services.AddTransient<ISupplierGroupRepository, SupplierGroupRepository>();
builder.Services.AddTransient<IStaffRepository, StaffRepository>();
builder.Services.AddTransient<IAccountRepository, AccountRepository>();
builder.Services.AddTransient<IActivityLogRepository, ActivityLogRepository>();


// adding validators
builder.Services.AddTransient<IValidator<QueryParameters>, QueryParametersValidator>();
builder.Services.AddTransient<IValidator<PromotionFilterModel>, PromotionFilterModelValidator>();
builder.Services.AddTransient<IValidator<SalesOrderFilterModel>, SalesOrderFilterModelValidator>();
builder.Services.AddTransient<IValidator<PurchaseOrderFilterModel>, PurchaseOrderFilterModelValidator>();
builder.Services.AddTransient<IValidator<ActivityLogFilterModel>, ActivityLogFilterModelValidator>();
builder.Services.AddTransient<IValidator<StaffFilterModel>, StaffFilterModelValidator>();
builder.Services.AddTransient<IValidator<SupplierFilterModel>, SupplierFilterModelValidator>();
builder.Services.AddTransient<IValidator<CustomerFilterModel>, CustomerFilterModelValidator>();
builder.Services.AddTransient<IValidator<ProductFilterModel>, ProductFilterModelValidator>();

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

    //Create the database with autoscale enabled
    var response = await cosmosClient.CreateDatabaseIfNotExistsAsync(databaseName);

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

app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler(exceptionHandlerApp =>
    {
        exceptionHandlerApp.Run(async context =>
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            // using static System.Net.Mime.MediaTypeNames;
            context.Response.ContentType = Text.Plain;

            await context.Response.WriteAsync("An exception was thrown.");

            var exceptionHandlerPathFeature =
                context.Features.Get<IExceptionHandlerPathFeature>();

            if (exceptionHandlerPathFeature?.Error is FileNotFoundException)
            {
                await context.Response.WriteAsync(" The file was not found.");
            }

            if (exceptionHandlerPathFeature?.Path == "/")
            {
                await context.Response.WriteAsync(" Page: Home.");
            }
        });
    });

    app.UseHsts();
}


app.UseCors();


app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();


async Task<bool> EnsureContainersAreCreatedAsync(Database database)
{
    var containersToCreate = new[]
    {
        ("categories", "/categoryId"),
        ("products", "/sku"),
        ("inventories", "/sku"),
        ("suppliers", "/supplierId"),
        ("supplierGroups", "/supplierGroupId"),
        ("salesOrders", "/monthYear"),
        ("purchaseOrders", "/monthYear"),
        ("promotions", "/promotionId"),
        ("customers","/customerId"),
        ("staffs", "/staffId"),
        ("activityLogs","/staffId")
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
    ContainerProperties properties = new()
    {
        Id = containerName,
        PartitionKeyPath = partitionKeyPath,
        // Expire all documents after 90 days
        DefaultTimeToLive = -1
    };

    var response = await database.CreateContainerIfNotExistsAsync(properties);

    if (response.StatusCode == HttpStatusCode.Created)
        app.Logger.LogInformation($"Container {containerName} created");
    else
        app.Logger.LogInformation($"Container {containerName} had already created before");

    return response.StatusCode;
}
