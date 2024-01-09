namespace BookstoreWebAPI.Exceptions
{
    public class AccountDisabledException(string message = "Account is disabled") : Exception(message) { }
}
