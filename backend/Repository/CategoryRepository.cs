using Microsoft.Azure.Cosmos;
using SE100_BookstoreWebAPI.Models.Documents;

namespace SE100_BookstoreWebAPI.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ILogger<CategoryRepository> _logger;
        private Container _categoryContainer;

        public CategoryRepository(CosmosClient cosmosClient, ILogger<CategoryRepository> logger) 
        {
            this._logger = logger;

            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            var containerName = "categories";

            _categoryContainer = cosmosClient.GetContainer(databaseName, containerName);
        }

        public async Task AddCategoryAsync(CategoryDocument item)
        {
            await _categoryContainer.UpsertItemAsync(
                item: item,
                partitionKey: new PartitionKey(item.CategoryId)
            );
        }


    }
}
