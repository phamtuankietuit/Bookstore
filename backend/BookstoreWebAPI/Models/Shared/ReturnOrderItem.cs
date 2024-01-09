using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class ReturnOrderItem
    {
        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("sku")]
        public string Sku { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("featureImageUrl")]
        public string FeatureImageUrl { get; set; }

        [JsonProperty("soldQuantity")]
        public int SoldQuantity { get; set; }

        [JsonProperty("salePrice")]
        public int SalePrice { get; set; }

        [JsonProperty("returnQuantity")]
        public int ReturnQuantity { get; set; }

        [JsonProperty("refund")]
        public int Refund { get; set; }

        [JsonProperty("totalRefund")]
        public int TotalRefund { get; set; }
    }
}
