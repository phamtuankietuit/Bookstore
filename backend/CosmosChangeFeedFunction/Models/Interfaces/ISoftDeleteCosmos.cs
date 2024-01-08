using Newtonsoft.Json;

namespace CosmosChangeFeedFunction.Models.Interfaces
{
    public interface ISoftDeleteCosmos
    {
        public bool IsDeleted { get; set; }
        public bool IsRemovable { get; set; }
    }
}
