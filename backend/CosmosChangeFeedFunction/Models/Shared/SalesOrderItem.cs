using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Documentshared
{
    public class SalesOrderItem
    {
        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("sku")]
        public string Sku { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("featureImageUrl")]
        public string FeatureImageUrl { get; set; }

        [JsonProperty("quantity")]
        public int Quantity { get; set; }

        [JsonProperty("salePrice")]
        public int SalePrice { get; set; }

        [JsonProperty("totalPrice")]
        public int TotalPrice { get; set; }
    }
}
