using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IProductRepository
    {
        Task AddProductDocumentAsync(ProductDocument product);
        Task AddInventoryDocumentAsync(InventoryDocument item);
        Task AddProductDTOAsync(ProductDTO productDTO);
        Task UpdateProductDTOAsync(ProductDTO productDTO);

        Task<string> GetNewProductIdAsync();
        Task<string> GetNewInventoryIdAsync();
        Task<IEnumerable<ProductDocument>> GetProductDocumentsAsync();
        Task<IEnumerable<ProductDTO>> GetProductDTOsAsync();
        Task<IEnumerable<ProductDocument>> GetProductDocumentsInCategoryAsync(string categoryId);
        //Task<IEnumerable<ProductDTO>> GetProductDTOsInCategoryAsync(string categoryName);
        Task<ProductDTO> GetProductDTOBySkuAsync(string sku);
        Task<ProductDTO> GetProductDTOByIdAsync(string id);
        Task DeleteProductDTOAsync(string id);
    }
}
