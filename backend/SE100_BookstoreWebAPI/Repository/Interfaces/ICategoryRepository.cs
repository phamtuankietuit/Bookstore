using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;

namespace SE100_BookstoreWebAPI.Repository.Interfaces
{
    public interface ICategoryRepository
    {
        Task AddCategoryDocumentAsync(CategoryDocument item);
        Task UpdateCategoryAsync(CategoryDTO item);
        Task AddCategoryDTOAsync(CategoryDTO item);

        Task<IEnumerable<CategoryDTO>> GetCategoryDTOsAsync();
        Task<CategoryDTO?> GetCategoryDTOByIdAsync(string id);
        Task DeleteCategoryAsync(string id);
        Task<string> GetNewCategoryIdAsync();
    }
}
