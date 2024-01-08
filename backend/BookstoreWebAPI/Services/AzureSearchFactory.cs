namespace BookstoreWebAPI.Services
{
    public class AzureSearchServiceFactory
    {
        private readonly IConfiguration _configuration;

        public AzureSearchServiceFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public AzureSearchService Create(string containerName)
        {
            return new AzureSearchService(
                _configuration["AzureSearch:ServiceName"]!,
                $"bookstore-{containerName.ToLower()}-cosmosdb-index",
                _configuration["AzureSearch:QueryApiKey"]!
            );
        }
    }
}
