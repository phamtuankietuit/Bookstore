namespace BookstoreWebAPI.Exceptions
{
    public class OrderReturnNotAllowedException(string message = "This order is not allowed to return") : Exception(message) { }
}
