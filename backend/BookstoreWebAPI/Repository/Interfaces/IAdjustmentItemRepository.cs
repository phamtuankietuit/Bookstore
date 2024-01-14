﻿using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IAdjustmentItemRepository
    {
        Task<IEnumerable<AdjustmentItemDTO>?> GetAdjustmentItemsByTicketIdAsync(string ticketId);
        Task<AdjustmentItemDTO?> AddAdjustmentItemDTOAsync(AdjustmentItemDTO adjustmentItemDTO);
        Task UpdateListAdjustmentItemDTOsAsync(List<AdjustmentItemDTO> adjustmentItemDTO);
    }
}
