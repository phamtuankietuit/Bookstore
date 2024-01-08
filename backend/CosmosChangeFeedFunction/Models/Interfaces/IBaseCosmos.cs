namespace CosmosChangeFeedFunction.Models.Interfaces
{
    public interface IBaseCosmos
    {
        public string Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int TTL { get; set; }
    }
}
