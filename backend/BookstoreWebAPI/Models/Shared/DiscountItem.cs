using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class DiscountItem
    {
        [JsonProperty("rate")]
        public int Rate { get; set; } = 0;

        [JsonProperty("value")]
        public int Value { get; set; } = 0;

        [JsonProperty("amount")]
        public int Amount { get; set; } = 0;

        [JsonProperty("source")]
        public string? Source { get; set; }

        [JsonProperty("promotionId")]
        public string? PromotionId { get; set; }
    }
}
