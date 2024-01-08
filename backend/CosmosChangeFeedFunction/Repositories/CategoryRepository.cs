using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;

namespace CosmosChangeFeedFunction.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private Container _categoryContainer;

        public CategoryRepository(CosmosClient cosmosClient) 
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _categoryContainer = cosmosClient.GetContainer(databaseName, "categories");
        }

        public async Task DeleteCategoryAsync(Category category)
        {
            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/ttl", 1),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            await _categoryContainer.PatchItemAsync<Category>(category.Id, new PartitionKey(category.Id), operations);
        }

        public async Task<Category?> GetCategoryByIdAsync(string categoryId)
        {
            QueryDefinition queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    "FROM c " +
                    "WHERE c.categoryId = @categoryId"
            ).WithParameter("@categoryId", categoryId);

            var category = await CosmosDbUtils.GetDocumentByQueryDefinition<Category>(_categoryContainer, queryDef);

            return category;
        }
    }
}
