using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IPurchaseOrderRepository
    {
        Task<int> GetTotalCount(QueryParameters queryParams, PurchaseOrderFilterModel filter);
        Task<IEnumerable<PurchaseOrderDTO>> GetPurchaseOrderDTOsAsync(QueryParameters queryParams, PurchaseOrderFilterModel filter);
        Task<PurchaseOrderDTO> GetPurchaseOrderDTOByIdAsync(string id);
        Task<PurchaseOrderDTO> AddPurchaseOrderDTOAsync(PurchaseOrderDTO item);
        Task UpdatePurchaseOrderAsync(PurchaseOrderDTO item);
        //Task<BatchDeletionResult<PurchaseOrderDTO>> DeletePurchaseOrdersAsync(string[] ids);


        // for data seeder, remove after production
        Task<ItemResponse<PurchaseOrderDocument>> AddPurchaseOrderDocumentAsync(PurchaseOrderDocument item);
    }
}
