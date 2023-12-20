using SE100_BookstoreWebAPI.Models.Documents;
using SE100_BookstoreWebAPI.Models.DTOs;

namespace SE100_BookstoreWebAPI.Repository.Interfaces
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
