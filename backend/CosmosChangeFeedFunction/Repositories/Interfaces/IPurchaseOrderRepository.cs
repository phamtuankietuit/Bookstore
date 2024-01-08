using CosmosChangeFeedFunction.Models.Documents;

namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface IPurchaseOrderRepository
    {

        Task<PurchaseOrder?> GetPurchaseOrderByIdAsync(string purchaseOrderId);
    }
}
