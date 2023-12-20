using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
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
