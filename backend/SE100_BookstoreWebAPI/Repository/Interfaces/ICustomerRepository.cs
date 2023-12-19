using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;

namespace SE100_BookstoreWebAPI.Repository.Interfaces
{
    public interface ICustomerRepository
    {
        Task AddCustomerDocumentAsync(CustomerDocument item);
        Task AddCustomerDTOAsync(CustomerDTO customerDTO);
        Task DeleteCustomerAsync(string id);
        Task<string> GetNewCustomerIdAsync();
        Task<CustomerDTO> GetCustomerDTOByIdAsync(string id);
        Task<IEnumerable<CustomerDTO>> GetCustomerDTOsAsync();
        Task UpdateCustomerAsync(CustomerDTO customerDTO);
    }
}
