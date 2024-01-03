using BookstoreWebAPI.Models.Interfaces;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class PromotionDocument : IBaseCosmosDocument, IActivatableDocument, ISoftDeleteCosmosDocument
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
        public int? ApplyToQuantity { get; set; }

        [JsonProperty("usedQuantity")]
        public int? UsedQuantity { get; set; }

        [JsonProperty("remainQuantity")]
        public int? RemainQuantity { get; set; }

        [JsonProperty("applyFromAmount")]
        public int ApplyFromAmount { get; set; } = 0;

        [JsonProperty("applyToAmount")]
        public int? ApplyToAmount { get; set; }

        [JsonProperty("discountRate")]
        public int DiscountRate { get; set; } = 0;

        [JsonProperty("discountValue")]
        public int DiscountValue { get; set; } = 0;

        [JsonProperty("startAt")]
        public DateTime StartAt { get; set; }

        [JsonProperty("closeAt")]
        public DateTime? CloseAt { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
        
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

