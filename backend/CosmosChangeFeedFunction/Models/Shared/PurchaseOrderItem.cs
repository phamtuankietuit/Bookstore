using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Shared
{
    public class PurchaseOrderItem
    {

        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("sku")]
        public string Sku { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("featureImageUrl")]
        public string FeatureImageUrl { get; set; }

        [JsonProperty("orderQuantity")]
        public int OrderQuantity { get; set; }

        [JsonProperty("purchasePrice")]
        public int PurchasePrice { get; set; }

        [JsonProperty("totalPrice")]
        public int TotalPrice { get; set; }
    }
}
