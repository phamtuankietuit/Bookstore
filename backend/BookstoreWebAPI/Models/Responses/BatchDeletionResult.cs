namespace BookstoreWebAPI.Models.Responses
{
    public class BatchDeletionResult<TDTO> where TDTO : class
    {
        public List<ResponseWithStatus<TDTO>> Responses {  get; set; }
        public bool IsNotSuccessful { get; set; }
        public bool IsNotForbidden { get; set; }
        public bool IsFound { get; set; }
    }
}
