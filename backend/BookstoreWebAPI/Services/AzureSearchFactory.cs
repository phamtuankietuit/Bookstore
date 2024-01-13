namespace BookstoreWebAPI.Services
{
    public class AzureSearchServiceFactory(IConfiguration configuration, ILogger<AzureSearchClientService> logger)
    {
        private readonly IConfiguration _configuration = configuration;

        public AzureSearchClientService Create(string containerName)
        {
            return new AzureSearchClientService(
                _configuration["AzureSearch:ServiceName"]!,
                $"bookstore-{containerName.ToLower()}-cosmosdb-index",
                _configuration["AzureSearch:QueryApiKey"]!,
                logger
            );
        }
    }
}
