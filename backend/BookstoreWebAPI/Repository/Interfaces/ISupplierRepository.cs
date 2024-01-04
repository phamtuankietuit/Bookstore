using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ISupplierRepository
    {
        Task<int> GetTotalCount();
        Task<IEnumerable<SupplierDTO>> GetSupplierDTOsAsync(QueryParameters queryParams, SupplierFilterModel filter);
        Task<SupplierDTO> GetSupplierDTOByIdAsync(string id);
        Task<SupplierDTO> AddSupplierDTOAsync(SupplierDTO supplierDTO);
        Task UpdateSupplierDTOAsync(SupplierDTO supplierDTO);
        Task<BatchDeletionResult<SupplierDTO>> DeleteSuppliersAsync(string[] ids);
    }
}
