namespace BookstoreWebAPI.Exceptions
{
    public class EmailNotFoundException(string message = "Email not found.") : Exception(message) { }
}
