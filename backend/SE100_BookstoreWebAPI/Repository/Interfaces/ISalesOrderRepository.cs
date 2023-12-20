using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ISalesOrderRepository
    {
        Task AddSalesOrderDocumentAsync(SalesOrderDocument item);
        Task AddSalesOrderDTOAsync(SalesOrderDTO salesOrderDTO);
        Task DeleteSalesOrderAsync(string id);
        Task<IEnumerable<SalesOrderDTO>> GetSalesOrderDTOsAsync();
        Task<string> GetNewOrderIdAsync();
        Task<SalesOrderDTO> GetSalesOrderDTOByIdAsync(string id);
        Task UpdateSalesOrderAsync(SalesOrderDTO salesOrderDTO);
    }
}
