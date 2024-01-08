using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Services
{
    public class AzureSearchClientFactory
    {
        private readonly IConfiguration _configuration;
        private readonly ILoggerFactory _loggerFactory;

        public AzureSearchClientFactory(IConfiguration configuration, ILoggerFactory loggerFactory)
        {
            _configuration = configuration;
            _loggerFactory = loggerFactory;
        }

        public AzureSearchClientService Create(string indexName)
        {
            return new AzureSearchClientService(
                _loggerFactory,
                _configuration["AzureSearchServiceName"]!,
                indexName,
                _configuration["AzureSearchApiKey"]!
            );
        }
    }
}
