using Newtonsoft.Json;

namespace BookstoreWebAPI.Models.Abstracts
{
    public interface IBaseCosmosDTO
    {
        public DateTime CreatedAt { get; set; }
    }
}
