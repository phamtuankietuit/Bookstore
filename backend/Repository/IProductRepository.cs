using SE100_BookstoreWebAPI.Models.BindingModels;
using SE100_BookstoreWebAPI.Models.Documents;

namespace SE100_BookstoreWebAPI.Repository
{
    public interface IProductRepository
    {
        Task AddProductAsync(ProductDocument product);
        Task AddInventoryAsync(InventoryDocument item);

        Task<IEnumerable<ProductDocument>> GetAllProductsInCategoryAsync(string categoryName);
        Task<ProductDocument?> GetProductBySkuAsync(string sku);
        
    }
}
