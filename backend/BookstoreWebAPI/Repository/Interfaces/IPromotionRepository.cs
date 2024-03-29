﻿using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IPromotionRepository
    {
        int TotalCount { get; }
        Task<IEnumerable<PromotionDTO>> GetPromotionDTOsAsync(QueryParameters queryParams, PromotionFilterModel filter);
        Task<PromotionDTO?> GetPromotionDTOByIdAsync(string id);
        Task<PromotionDTO> AddPromotionDTOAsync(PromotionDTO promotionDTO);
        Task UpdatePromotionDTOAsync(PromotionDTO supplierDTO);
        Task<BatchDeletionResult<PromotionDTO>> DeletePromotionDTOsAsync(string[] ids);
    }
}
