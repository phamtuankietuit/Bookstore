using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Models.Shared;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;

namespace CosmosChangeFeedFunction.Repositories
{
    public class PromotionRepository : IPromotionRepository
    {
        private readonly Container _promotionContainer;

        public PromotionRepository(
            CosmosClient cosmosClient
        )
        {
            var containerName = "promotions";
            var databaseName = cosmosClient.ClientOptions.ApplicationName;
            _promotionContainer = cosmosClient.GetContainer(databaseName, containerName);

        }

        public async Task UpdateQuantity(SalesOrder salesOrder)
        {
            string? promotionId = string.Empty;
            DiscountItem? soPromotionDiscountItem;

            if (salesOrder != null && salesOrder.DiscountItems != null && salesOrder.DiscountItems.Count > 0)
            {
                soPromotionDiscountItem = salesOrder.DiscountItems.Where(di => di.PromotionId != null).FirstOrDefault();
                if (soPromotionDiscountItem != null)
                {
                    promotionId = soPromotionDiscountItem.PromotionId;
                }
                else
                {
                    return;
                }
            }
            else
            {
                return;
            }

            if (promotionId == null)
            {
                return;
            }

            var promotionToUpdate = await GetPromotionByIdAsync(promotionId);

            if (promotionToUpdate == null)
            {
                return;
            }


            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/usedQuantity", promotionToUpdate.UsedQuantity + 1),
                PatchOperation.Replace("/remainQuantity", promotionToUpdate.RemainQuantity - 1),
                PatchOperation.Replace("/status", promotionToUpdate.RemainQuantity == 1? "stopped":"running"),
                PatchOperation.Replace("/isActive", promotionToUpdate.RemainQuantity == 1 ? false:true),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            await _promotionContainer.PatchItemAsync<Promotion>(promotionToUpdate.Id, new PartitionKey(promotionToUpdate.Id), operations);
        }

        private async Task<Promotion?> GetPromotionByIdAsync(string promotionId)
        {
            var queryDef = new QueryDefinition(
                query:
                "SELECT * " +
                "FROM c " +
                "WHERE c.id = @promotionId"
            ).WithParameter("@promotionId",promotionId);

            var result = await CosmosDbUtils.GetDocumentByQueryDefinition<Promotion>(_promotionContainer, queryDef);

            return result;
        }
    }
}
