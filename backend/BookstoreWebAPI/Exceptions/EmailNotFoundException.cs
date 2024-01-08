namespace BookstoreWebAPI.Exceptions
{
    public class EmailNotFoundException : Exception
    {
        public EmailNotFoundException(string message = "Email not found.") : base(message)
        {
            
        }
    }
}
