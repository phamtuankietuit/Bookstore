namespace BookstoreWebAPI.Exceptions
{
    public class LogTimestampNotFoundException(string message = "ActivityLog timestamp missing.") : Exception(message) { }
}
