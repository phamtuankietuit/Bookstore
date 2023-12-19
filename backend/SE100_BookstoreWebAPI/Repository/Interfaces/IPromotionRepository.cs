using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;

namespace SE100_BookstoreWebAPI.Repository.Interfaces
{
    public interface IPromotionRepository
    {
        Task AddPromotionDocumentAsync(PromotionDocument item);
        Task AddPromotionDTOAsync(PromotionDTO promotionDTO);
        Task DeletePromotionAsync(string id);
        Task<string> GetNewPromotionIdAsync();
        Task<PromotionDTO> GetPromotionDTOByIdAsync(string id);
        Task<IEnumerable<PromotionDTO>> GetPromotionDTOsAsync();
        Task UpdatePromotionAsync(PromotionDTO supplierDTO);
    }
}
