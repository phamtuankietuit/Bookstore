using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class PriceHistory
    {
        [JsonProperty("date")]
        public DateTime? Date { get; set; }
        
        [JsonProperty("value")]
        public int Value { get; set; }
    }
}
