using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IReturnOrderRepository
    {
        int TotalCount { get; }
        Task<IEnumerable<ReturnOrderDTO>> GetReturnOrderDTOsAsync(QueryParameters queryParams, ReturnOrderFilterModel filter);
        Task<ReturnOrderDTO?> GetReturnOrderDTOByIdAsync(string id);
        Task<ReturnOrderDTO?> GetInitReturnOrderDTO(string salesOrderId);  
        Task<ReturnOrderDTO> AddReturnOrderDTOAsync(ReturnOrderDTO ReturnOrderDTO);
        Task UpdateReturnOrderDTOAsync(ReturnOrderDTO ReturnOrderDTO);

    }
}
