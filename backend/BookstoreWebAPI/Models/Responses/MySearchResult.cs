namespace BookstoreWebAPI.Models.Responses
{
    public class MySearchResult<T> where T : class
    {
        public List<T?> Results { get; set; }
        public int TotalCount { get; set; }
    }
}
