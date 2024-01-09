using CosmosChangeFeedFunction.Models.Documents;

namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface IPromotionRepository
    {
        Task UpdateQuantity(SalesOrder salesOrder);
    }
}
