using BookstoreWebAPI.Models.Interfaces;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class AdjustmentBalance
    {
        [JsonProperty("adjustedQuantity")]
        public int AdjustedQuantity { get; set; }

        [JsonProperty("afterQuantity")]
        public int AfterQuantity { get; set; }

        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}
