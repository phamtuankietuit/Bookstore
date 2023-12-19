using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;

namespace SE100_BookstoreWebAPI.Repository.Interfaces
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
