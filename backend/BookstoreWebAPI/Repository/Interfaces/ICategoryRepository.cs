using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ICategoryRepository
    {
        Task<int> GetTotalCount(QueryParameters queryParams);
        Task<IEnumerable<CategoryDTO>> GetCategoryDTOsAsync(QueryParameters queryParams);
        Task<CategoryDTO?> GetCategoryDTOByIdAsync(string id);
        Task<CategoryDTO> AddCategoryDTOAsync(CategoryDTO item);
        Task UpdateCategoryDTOAsync(CategoryDTO item);
        Task<BatchDeletionResult<CategoryDTO>> DeleteCategoriesAsync(string[] ids);
    }
}
