using Newtonsoft.Json;

namespace SE100_BookstoreWebAPI.Models.Documents
{
    public class PromotionDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("promotionId")]
        public string PromotionId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("typeName")]
        public string TypeName { get; set; }

        [JsonProperty("applyToQuantity")]
        public int ApplyToQuantity { get; set; }

        [JsonProperty("usedQuantity")]
        public int UsedQuantity { get; set; }

        [JsonProperty("remainQuantity")]
        public int RemainQuantity { get; set; }

        [JsonProperty("applyFromAmount")]
        public int ApplyFromAmount { get; set; }

        [JsonProperty("applyToAmount")]
        public int ApplyToAmount { get; set; }

        [JsonProperty("discountRate")]
        public int DiscountRate { get; set; }

        [JsonProperty("discountValue")]
        public int DiscountValue { get; set; }

        [JsonProperty("startAt")]
        public string StartAt { get; set; }

        [JsonProperty("closeAt")]
        public string CloseAt { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }
}

