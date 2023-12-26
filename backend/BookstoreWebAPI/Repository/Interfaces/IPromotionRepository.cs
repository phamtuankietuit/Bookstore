using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
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
