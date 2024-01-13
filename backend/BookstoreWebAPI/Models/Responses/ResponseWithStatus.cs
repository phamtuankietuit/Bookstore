namespace BookstoreWebAPI.Models.Responses
{
    public class ResponseWithStatus<TDTO> where TDTO : class
    {
        public int Id { get; set; }
        public int Status { get; set; }
        public TDTO Data { get; set; }

        public ResponseWithStatus(int id, int status, TDTO data)
        {
            Id = id;
            Status = status;
            Data = data;
        }
    }
}
