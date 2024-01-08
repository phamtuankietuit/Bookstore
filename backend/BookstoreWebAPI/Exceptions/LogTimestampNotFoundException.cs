namespace BookstoreWebAPI.Exceptions
{
    public class LogTimestampNotFoundException : Exception
    {
        public LogTimestampNotFoundException(string message = "ActivityLog timestamp missing.") : base(message)
        {
            
        }
    }
}
