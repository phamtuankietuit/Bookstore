using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IAdjustmentTicketRepository
    {
        int TotalCount { get; }
        Task<IEnumerable<AdjustmentTicketDTO>> GetAdjustmentTicketDTOsAsync(QueryParameters queryParams, AdjustmentTicketFilterModel filter);
        Task<AdjustmentTicketDTO> GetAdjustmentTicketDTOByIdAsync(string id);
        Task<AdjustmentTicketDTO> AddAdjustmentTicketDTOAsync(AdjustmentTicketDTO adjustmentTicketDTO);
        Task UpdateAdjustmentTicketDTOAsync(AdjustmentTicketDTO adjustmentTicketDTO);
    }
}
