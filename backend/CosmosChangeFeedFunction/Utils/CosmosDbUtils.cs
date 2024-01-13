using Microsoft.Azure.Cosmos;

namespace CosmosChangeFeedFunction.Utils
{
    public class CosmosDbUtils
    {
        public static async Task<IEnumerable<T>?> GetDocumentsByQueryDefinition<T>(Container container, QueryDefinition queryDefinition)
        {
            var results = new List<T>();

            using var feed = container.GetItemQueryIterator<T>(queryDefinition);

            double requestCharge = 0d;

            while (feed.HasMoreResults)
            {
                var response = await feed.ReadNextAsync();
                requestCharge += response.RequestCharge;

                results.AddRange(response);
            }

            //LogRequestCharged(requestCharge);

            return results;
        }

        public static async Task<T?> GetDocumentByQueryDefinition<T>(Container container, QueryDefinition queryDefinition)
        {
            using var feed = container.GetItemQueryIterator<T>(
                queryDefinition: queryDefinition
            );

            FeedResponse<T> response;

            if (feed.HasMoreResults)
            {
                response = await feed.ReadNextAsync();
                return response.FirstOrDefault();
            }

            //LogRequestCharged(response.RequestCharge);

            return default;
        }
    }
}
