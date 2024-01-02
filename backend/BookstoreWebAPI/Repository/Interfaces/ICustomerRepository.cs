﻿using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ICustomerRepository
    {
        Task<int> GetTotalCount(QueryParameters queryParams, CustomerFilterModel filter);
        Task<IEnumerable<CustomerDTO>> GetCustomerDTOsAsync(QueryParameters queryParams, CustomerFilterModel filter);
        Task<CustomerDTO?> GetCustomerDTOByIdAsync(string id);
        Task<CustomerDTO> AddCustomerDTOAsync(CustomerDTO customerDTO);
        Task UpdateCustomerDTOAsync(CustomerDTO customerDTO);
        Task<BatchDeletionResult<CustomerDTO>> DeleteCustomerDTOsAsync(string[] ids);


        // make private after production
        Task<ItemResponse<CustomerDocument>> AddCustomerDocumentAsync(CustomerDocument item);
    }
}
