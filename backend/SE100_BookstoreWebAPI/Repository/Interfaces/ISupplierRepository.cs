using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;

namespace SE100_BookstoreWebAPI.Repository.Interfaces
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
