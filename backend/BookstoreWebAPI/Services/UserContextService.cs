namespace BookstoreWebAPI.Services
{
    public class UserContextService 
    {
        private static AsyncLocal<UserContext> userContext = new AsyncLocal<UserContext>();

        public UserContext Current
        {
            get
            {
                if (userContext.Value == null)
                {
                    userContext.Value = new UserContext();
                }

                return userContext.Value;
            }
        }
    }
}
