using Newtonsoft.Json;

namespace ChangeFeedCatchFunction.Models
{
    public class Product
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("categoryId")]
        public string CategoryId { get; set; }

        [JsonProperty("categoryName")]
        public string CategoryName { get; set; }

        [JsonProperty("sku")]
        public string Sku { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("salePrice")]
        public int SalePrice { get; set; }

        [JsonProperty("purchasePrice")]
        public int PurchasePrice { get; set; }

        [JsonProperty("attributes")]
        public List<string> Attributes { get; set; }

        [JsonProperty("details")]
        public Dictionary<string, string> Details { get; set; }

        [JsonProperty("ratings")]
        public Ratings Ratings { get; set; }

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("images")]
        public List<string> Images { get; set; }

        [JsonProperty("tags")]
        public List<string> Tags { get; set; }
    }
}
