using System.Text.RegularExpressions;

namespace BookstoreWebAPI.Utils
{
    public partial class IdUtils
    {
        public static string IncreaseId(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                // Create a regular expression object with the pattern
                Regex regex = IdRegex();

                // Try to match the id with the pattern
                Match match = regex.Match(id);

                // If the match is successful, extract the prefix and the numeric part
                if (match.Success)
                {
                    string prefix = match.Groups[1].Value;
                    string numericPart = match.Groups[2].Value;

                    // Parse the numeric part as an integer and increment it
                    if (int.TryParse(numericPart, out int numericValue))
                    {
                        numericValue++;

                        // Format the new id with the same prefix and the same number of digits as the original id
                        string newId = $"{prefix}{numericValue.ToString(new string('0', numericPart.Length))}";
                        return newId;
                    }
                    else
                    {
                        throw new ArgumentException("Invalid id to increase");
                    }
                }
            }

            return id;
        }

        [GeneratedRegex("^([A-Za-z]+)(\\d+)$")]
        private static partial Regex IdRegex();
    }
}
