using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Documentshared
{
    public class DiscountItem
    {
        [JsonProperty("reason")]
        public string? Reason { get; set; }

        [JsonProperty("rate")]
        public int Rate { get; set; } = 0;

        [JsonProperty("value")]
        public int Value { get; set; } = 0;

        [JsonProperty("amount")]
        public int Amount { get; set; } = 0;

        [JsonProperty("source")]
        public string? Source { get; set; }
    }
}
