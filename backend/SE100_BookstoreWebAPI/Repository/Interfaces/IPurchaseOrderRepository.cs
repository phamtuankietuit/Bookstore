using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IPurchaseOrderRepository
    {
        Task AddPurchaseOrderDocumentAsync(PurchaseOrderDocument item);
        Task AddPurchaseOrderDTOAsync(PurchaseOrderDTO purchaseOrderDTO);
        Task DeletePurchaseOrderAsync(string id);
        Task<IEnumerable<PurchaseOrderDTO>> GetPurchaseOrderDTOsAsync();
        Task<string> GetNewPurchaseOrderIdAsync();
        Task<PurchaseOrderDTO> GetPurchaseOrderDTOByIdAsync(string id);
        Task UpdatePurchaseOrderAsync(PurchaseOrderDTO purchaseOrderDTO);
    }
}
