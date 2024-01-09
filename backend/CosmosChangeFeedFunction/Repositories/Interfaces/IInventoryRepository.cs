
using CosmosChangeFeedFunction.Models.Documents;

namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface IInventoryRepository
    {
        Task UpdateStockFromPO(string productId, int importQuantity);
        Task UpdateStockFromSO(string productId, int saleQuantity);
        Task UpdateStockFromRO(string productId, int returnQuantity);
        Task UpdateProduct(Product product);
    }
}
