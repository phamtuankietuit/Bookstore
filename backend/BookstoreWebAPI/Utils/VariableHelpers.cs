namespace BookstoreWebAPI.Utils
{
    public class VariableHelpers
    {
        public static bool IsNull<T>(IEnumerable<T>? valueToCheck)
        {
            return valueToCheck == null || !valueToCheck.Any();
        }
    }
}
