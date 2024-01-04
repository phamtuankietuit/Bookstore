namespace BookstoreWebAPI.Models.Interfaces
{
    public interface IBaseCosmosDocument
    {
        public string Id { get; set; }
        public string StaffId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public int TTL { get; set; }
    }
}
