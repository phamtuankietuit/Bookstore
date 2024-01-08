
namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface IInventoryRepository
    {
        Task UpdateStockFromPO(string productId, int importQuantity);
        Task UpdateStockFromSO(string productId, int saleQuantity);
        Task UpdateProductNameInside(string productId, string newProductName);
    }
}
