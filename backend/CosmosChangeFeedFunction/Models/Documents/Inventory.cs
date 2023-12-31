﻿using CosmosChangeFeedFunction.Models.Interfaces;
using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Documents
{
    public class Inventory : IBaseCosmos, ISoftDeleteCosmos
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("sku")]
        public string Sku { get; set; }

        [JsonProperty("barcode")]
        public string Barcode { get; set; }

        [JsonProperty("productName")]
        public string ProductName { get; set; }

        [JsonProperty("currentStock")]
        public int CurrentStock { get; set; }

        [JsonProperty("minStock")]
        public int MinStock { get; set; }

        [JsonProperty("maxStock")]
        public int MaxStock { get; set; }

        [JsonProperty("lastRestocked")]
        public DateTime LastRestocked { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
        
        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }
        
        [JsonProperty("isRemovable")]
        public bool IsRemovable { get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("ttl")]
        public int TTL { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }
    }
}
