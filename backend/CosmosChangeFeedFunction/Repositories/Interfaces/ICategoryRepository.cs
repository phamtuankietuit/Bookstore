using CosmosChangeFeedFunction.Models.Documents;

namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task DeleteCategoryAsync(Category updatedCategory);
        Task<Category?> GetCategoryByIdAsync(string categoryId);
    }
}
