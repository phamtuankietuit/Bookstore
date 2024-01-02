using BookstoreWebAPI.Models.Interfaces;
using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Documents
{
    public class SupplierGroupDocument : IBaseCosmosDocument, ISoftDeleteCosmosDocument
    {
        
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("supplierGroupId")]
        public string SupplierGroupId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("numberOfSupplier")]
        public int NumberOfSupplier { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("isRemovable")]
        public bool IsRemovable { get; set; }

        [JsonProperty("isDeleted")]
        public bool IsDeleted { get; set; }

        [JsonProperty("createdAt")]
        public DateTime? CreatedAt { get; set; }
        
        [JsonProperty("ttl")]
        public int TTL { get; set; }
    }
}
