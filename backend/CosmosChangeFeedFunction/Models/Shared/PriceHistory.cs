using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Shared
{
    public class PriceHistory
    {
        [JsonProperty("date")]
        public DateTime? Date { get; set; }

        [JsonProperty("value")]
        public int Value { get; set; }
    }
}
