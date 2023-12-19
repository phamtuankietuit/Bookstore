using Newtonsoft.Json;

namespace ChangeFeedCatchFunction.Models
{
    public class Ratings
    {
        [JsonProperty("averageRating")]
        public int AverageRating { get; set; }

        [JsonProperty("numberOfRatings")]
        public int NumberOfRatings { get; set; }
    }
}
