using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ISupplierRepository
    {
        Task AddSupplierDocumentAsync(SupplierDocument item);
        Task AddSupplierDTOAsync(SupplierDTO supplierDTO);
        Task DeleteSupplierAsync(string id);
        Task<string> GetNewSupplierIdAsync();
        Task<SupplierDTO> GetSupplierDTOByIdAsync(string id);
        Task<IEnumerable<SupplierDTO>> GetSupplierDTOsAsync();
        Task UpdateSupplierAsync(SupplierDTO supplierDTO);
    }
}
