using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface ISalesOrderRepository
    {
        int TotalCount { get; }
        Task<IEnumerable<SalesOrderDTO>> GetSalesOrderDTOsAsync(QueryParameters queryParams, SalesOrderFilterModel filter);
        Task<SalesOrderDTO?> GetSalesOrderDTOByIdAsync(string id);
        Task<SalesOrderDTO> AddSalesOrderDTOAsync(SalesOrderDTO salesOrderDTO);
        Task UpdateSalesOrderDTOAsync(SalesOrderDTO salesOrderDTO);
    }
}
