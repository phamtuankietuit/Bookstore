using Newtonsoft.Json;

namespace SE100_BookstoreWebAPI.Models.Shared
{
    public class OrderDiscount
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("value")]
        public int Value { get; set; }
    }
}
