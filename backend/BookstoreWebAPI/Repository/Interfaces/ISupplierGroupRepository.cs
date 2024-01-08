using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ISupplierGroupRepository
    {
        int TotalCount { get; }
        Task<int> GetTotalCount();
        Task<IEnumerable<SupplierGroupDTO>> GetSupplierGroupDTOsAsync(QueryParameters queryParams, SupplierGroupFilterModel filter);
        Task<SupplierGroupDTO?> GetSupplierGroupDTOByIdAsync(string id);
        Task<SupplierGroupDTO> AddSupplierGroupDTOAsync(SupplierGroupDTO item);
        Task UpdateSupplierGroupDTOAsync(SupplierGroupDTO item);
        Task<BatchDeletionResult<SupplierGroupDTO>> DeleteSupplierGroupsAsync(string[] ids);
    }
}
