using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ISupplierGroupRepository
    {
        Task<int> GetTotalCount();
        Task<IEnumerable<SupplierGroupDTO>> GetSupplierGroupDTOsAsync(QueryParameters queryParams);
        Task<SupplierGroupDTO?> GetSupplierGroupDTOByIdAsync(string id);
        Task<SupplierGroupDTO> AddSupplierGroupDTOAsync(SupplierGroupDTO item);
        Task UpdateSupplierGroupDTOAsync(SupplierGroupDTO item);
        Task<BatchDeletionResult<SupplierGroupDTO>> DeleteSupplierGroupsAsync(string[] ids);


        // for data seeder, remove after production
        Task<ItemResponse<SupplierGroupDocument>> AddSupplierGroupDocumentAsync(SupplierGroupDocument item);
    }
}
