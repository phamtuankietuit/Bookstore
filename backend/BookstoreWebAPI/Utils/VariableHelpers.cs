using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BookstoreWebAPI.Utils
{
    public class VariableHelpers
    {
        public static bool IsNull<T>(IEnumerable<T>? valueToCheck)
        {
            return valueToCheck == null || !valueToCheck.Any();
        }


        public static bool IsNull<T>(T valueToCheck)
        {
            return valueToCheck == null;
        }

        public static bool BeAValidDate(DateTime? date)
        {
            return date != null && date != default(DateTime);
        }

        public static int RoundToThoudsand(double value)
        {
            return (int)(Math.Floor(value / 1000) * 1000);
        }
    }
}
