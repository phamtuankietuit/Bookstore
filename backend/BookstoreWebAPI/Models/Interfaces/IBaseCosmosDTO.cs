using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Interfaces
{
    public interface IBaseCosmosDTO
    {
        public DateTime? CreatedAt { get; set; }
    }
}
