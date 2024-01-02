namespace BookstoreWebAPI.Models.Responses
{
    public class BatchDeletionResult<TDTO> where TDTO : class
    {
        public List<ResponseWithStatus<TDTO>> Responses {  get; set; }
        public bool IsSuccessful { get; set; }
        public bool IsForbidden { get; set; }
        public bool IsNotFound { get; set; }
    }
}
