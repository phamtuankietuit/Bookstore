using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;

namespace BookstoreWebAPI.Models.DTOs
{
    public class ProductDTO
    {
        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("categoryId")]
        public string CategoryId { get; set; }

        [JsonProperty("categoryName")]
        public string CategoryName { get; set; }

        [JsonProperty("barcode")]
        public string Barcode { get; set; }

        [JsonProperty("sku")]
        public string Sku { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("currentStock")]
        public int CurrentStock { get; set; }

        [JsonProperty("minStock")]
        public int MinStock { get; set; }

        [JsonProperty("maxStock")]
        public int MaxStock { get; set; }

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

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("images")]
        public List<string> Images { get; set; }

        [JsonProperty("tags")]
        public List<string> Tags { get; set; }
    }
}
