using ChangeFeedCatchFunction.Models;

namespace ChangeFeedCatchFunction.Repositories
{
    public interface ICategoryRepository
    {
        Task DeleteCategoryAsync(Category updatedCategory);
        Task<Category> GetCategoryDocumentByIdAsync(string categoryId);
    }
}
