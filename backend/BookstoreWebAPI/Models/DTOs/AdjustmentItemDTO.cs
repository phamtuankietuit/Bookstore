﻿using BookstoreWebAPI.Models.Interfaces;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.DTOs
{
    public class AdjustmentItemDTO : IBaseCosmosDTO
    {
        [JsonProperty("adjustmentItemId")]
        public string? AdjustmentItemId { get; set; }

        [JsonProperty("adjustmentTicketId")]
        public string? AdjustmentTicketId { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("adjustedQuantity")]
        public int? AdjustedQuantity { get; set; } // server compute

        [JsonProperty("quantity")]
        public int Quantity { get; set; }

        [JsonProperty("reason")]
        public string Reason { get; set; }

        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("productName")]
        public string ProductName { get; set; }

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("tags")]
        public List<string>? Tags { get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }

        [JsonProperty("modifiedAt")]
        public DateTime? ModifiedAt { get; set; }
    }
}
