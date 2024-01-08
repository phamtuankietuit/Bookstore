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
        int TotalCount { get; set; }

        Task<int> GetTotalCount(QueryParameters queryParams, ProductFilterModel filter);
        Task<IEnumerable<ProductDTO>> GetProductDTOsAsync(QueryParameters queryParams, ProductFilterModel filter);
        Task<ProductDTO> GetProductDTOByIdAsync(string id);
        Task<IEnumerable<string>?> GetDetailsAsync(string detailName);
        Task<ProductDTO> AddProductDTOAsync(ProductDTO productDTO);
        Task UpdateProductDTOAsync(ProductDTO productDTO);
        Task<BatchDeletionResult<ProductDTO>> DeleteProductsAsync(string[] ids);
    }
}
