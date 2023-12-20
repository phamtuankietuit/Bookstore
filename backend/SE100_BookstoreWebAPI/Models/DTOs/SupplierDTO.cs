using Newtonsoft.Json;
using BookstoreWebAPI.Models.Shared;

namespace BookstoreWebAPI.Models.DTOs
{
    public class SupplierDTO
    {

        [JsonProperty("supplierId")]
        public string SupplierId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("contact")]
        public Contact Contact { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("productsSupplied")]
        public List<ProductsSupplied> ProductsSupplied { get; set; }
    }
}
