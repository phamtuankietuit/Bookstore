using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IProductRepository
    {
        Task<int> GetTotalCount(QueryParameters queryParams, ProductFilterModel filter);
        Task<IEnumerable<ProductDTO>> GetProductDTOsAsync(QueryParameters queryParams, ProductFilterModel filter);
        Task<ProductDTO> GetProductDTOByIdAsync(string id);
        Task<IEnumerable<string>?> GetDetailsAsync(string detailName);
        Task<ProductDTO> AddProductDTOAsync(ProductDTO productDTO);
        Task UpdateProductDTOAsync(ProductDTO productDTO);
        Task<BatchDeletionResult<ProductDTO>> DeleteProductsAsync(string[] ids);


        // for data seeder, remove after production
        Task<ItemResponse<ProductDocument>> AddProductDocumentAsync(ProductDocument product);
        Task<ItemResponse<InventoryDocument>> AddInventoryDocumentAsync(InventoryDocument item);
    }
}
