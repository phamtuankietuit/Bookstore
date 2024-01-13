using CosmosChangeFeedFunction.Models.Documents;

namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface ICustomerRepository
    {
        Task<Customer?> UpdateReturnOrderInformation(ReturnOrder updatedReturnOrder);
        Task<Customer?> UpdateSalesOrderInformation(SalesOrder salesOrder);
    }
}
