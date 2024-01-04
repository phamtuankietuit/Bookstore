using BookstoreWebAPI.Models.Interfaces;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class PromotionDTO : IBaseCosmosDTO, IActivableDTO
    {
        [JsonProperty("promotionId")]
        public string? PromotionId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("type")]
        public string? Type { get; set; }

        [JsonProperty("typeName")]
        public string? TypeName { get; set; }

        [JsonProperty("applyToQuantity")]
        public int? ApplyToQuantity { get; set; }

        [JsonProperty("usedQuantity")]
        public int UsedQuantity { get; set; } = 0;

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

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("status")]
        public string? Status { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }

        [JsonProperty("staffId")]
        public string? StaffId { get; set; }
    }
}
