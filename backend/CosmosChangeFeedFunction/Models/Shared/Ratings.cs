using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Documentshared
{
    public class Ratings
    {
        [JsonProperty("averageRating")]
        public int AverageRating { get; set; }

        [JsonProperty("numberOfRatings")]
        public int NumberOfRatings { get; set; }
    }
}
