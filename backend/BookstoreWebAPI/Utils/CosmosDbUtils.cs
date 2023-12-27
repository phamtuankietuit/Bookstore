using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Utils
{
    public class CosmosDbUtils
    {
        public static async Task<IEnumerable<TDocument>> GetDocumentsByQueryDefinition<TDocument>(Container container, QueryDefinition queryDefinition)
        {
            var results = new List<TDocument>();

            using var feed = container.GetItemQueryIterator<TDocument>(queryDefinition);

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

        public static async Task<TDocument?> GetDocumentByQueryDefinition<TDocument>(Container container, QueryDefinition queryDefinition)
        {
            using var feed = container.GetItemQueryIterator<TDocument>(
                queryDefinition: queryDefinition
            );

            FeedResponse<TDocument> response;
            
            if (feed.HasMoreResults)
            {
                response = await feed.ReadNextAsync();
                return response.FirstOrDefault();
            }

            //LogRequestCharged(response.RequestCharge);

            return default;
        }

        public static void CheckForNullToThrowException<TDocument>(TDocument document)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));
        }
    }
}
