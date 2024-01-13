namespace BookstoreWebAPI.Exceptions
{
    public class InvalidEmailException(string? message = "Invalid Email") : Exception(message) { }
}
