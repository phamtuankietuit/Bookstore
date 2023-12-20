using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Shared
{
    public class OrderDiscount
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("value")]
        public int Value { get; set; }
    }
}
