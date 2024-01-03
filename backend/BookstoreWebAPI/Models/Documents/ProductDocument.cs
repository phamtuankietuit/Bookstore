using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;
using BookstoreWebAPI.Models.Interfaces;

namespace BookstoreWebAPI.Models.Documents
{
    public class ProductDocument : IBaseCosmosDocument, IActivatableDocument, ISoftDeleteCosmosDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("categoryId")]
        public string CategoryId { get; set; }

        [JsonProperty("categoryName")]
        public string CategoryName { get; set; }

        [JsonProperty("categoryText")]
        public string CategoryText { get; set; }

        [JsonProperty("supplierId")]
        public string SupplierId { get; set; }

        [JsonProperty("supplierName")]
        public string SupplierName { get; set; }

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
        public Dictionary<string,string> Details { get; set; }

        [JsonProperty("optionalDetails")]
        public List<OptionalDetails> OptionalDetails { get; set; }

        [JsonProperty("ratings")]
        public Ratings Ratings { get; set; }


        [JsonProperty("images")]
        public List<string> Images { get; set; }

        [JsonProperty("tags")]
        public List<string> Tags { get; set; }
        
        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }
        
        [JsonProperty("isRemovable")]
        public bool IsRemovable { get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }
        
        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
