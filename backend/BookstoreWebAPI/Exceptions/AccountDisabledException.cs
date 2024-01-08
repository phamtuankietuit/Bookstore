namespace BookstoreWebAPI.Exceptions
{
    public class AccountDisabledException : Exception
    {
        public AccountDisabledException(string message = "Account is disabled") : base(message) 
        {
             
        }
    }
}
