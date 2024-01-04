namespace BookstoreWebAPI.Exceptions
{
    public class InvalidEmailException : Exception
    {
        public InvalidEmailException(string? message = "Invalid Email"):base(message)
        { 
        }

    }
}
