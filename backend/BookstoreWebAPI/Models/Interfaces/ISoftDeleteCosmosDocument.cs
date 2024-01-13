using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Interfaces
{
    public interface ISoftDeleteCosmosDocument
    {
        public bool IsDeleted { get; set; }
        public bool IsRemovable { get; set; }
    }
}
