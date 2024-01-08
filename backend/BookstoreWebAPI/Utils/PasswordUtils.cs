namespace BookstoreWebAPI.Utils
{
    public class PasswordUtils
    {
        public static string GenerateDefaultPassword()
        {
            var rng = new Random();
            int number = rng.Next(100000, 999999);
            return number.ToString();
        }
    }
}
