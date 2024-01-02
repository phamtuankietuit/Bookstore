using Newtonsoft.Json;
using BookstoreWebAPI.Models.Interfaces;

namespace BookstoreWebAPI.Models.DTOs
{
    public class ProductDTO : IBaseCosmosDTO
    {
        [JsonProperty("productId")]
        public string? ProductId { get; set; }

        [JsonProperty("categoryId")]
        public string? CategoryId { get; set; }

        [JsonProperty("categoryName")]
        public string? CategoryName { get; set; }

        [JsonProperty("categoryText")]
        public string? CategoryText { get; set; }

        [JsonProperty("supplierId")]
        public string SupplierId { get; set; }

        [JsonProperty("supplierName")]
        public string SupplierName { get; set; }

        [JsonProperty("barcode")]
        public string? Barcode { get; set; }

        [JsonProperty("sku")]
        public string? Sku { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("currentStock")]
        public int CurrentStock { get; set; } = 0;

        [JsonProperty("minStock")]
        public int MinStock { get; set; } = 0;

        [JsonProperty("maxStock")]
        public int MaxStock { get; set; } = 0;

        [JsonProperty("description")]
        public string? Description { get; set; }

        [JsonProperty("salePrice")]
        public int SalePrice { get; set; } = 0;

        [JsonProperty("purchasePrice")]
        public int PurchasePrice { get; set; } = 0;

        [JsonProperty("attributes")]
        public List<string>? Attributes { get; set; }

        [JsonProperty("details")]
        public Dictionary<string, string>? Details { get; set; }

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("status")]
        public string? Status { get; set; } // in stock / out of stock / low stock

        [JsonProperty("images")]
        public List<string>? Images { get; set; }

        [JsonProperty("tags")]
        public List<string>? Tags { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }
    }
}
