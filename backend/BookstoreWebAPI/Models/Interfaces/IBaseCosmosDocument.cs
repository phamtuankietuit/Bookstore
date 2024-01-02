namespace BookstoreWebAPI.Models.Interfaces
{
    public interface IBaseCosmosDocument
    {
        public string Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int TTL { get; set; }
    }
}
