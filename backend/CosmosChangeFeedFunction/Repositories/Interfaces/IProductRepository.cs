using CosmosChangeFeedFunction.Models.Documents;

namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>?> UpdateCategoriesAsync(string categoryId);
        Task<IEnumerable<Product>?> UpdateSuppliersAsync(string supplierId);
        Task<IEnumerable<Product>?> ResetCategoryAsync(string categoryId);
        Task<IEnumerable<Product>?> ResetSuppliersAsync(string supplierId);
    }
}
