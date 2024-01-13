using System.Globalization;

namespace BookstoreWebAPI.Utils
{
    public class StringUtils
    {
        public static string RemoveAccentsAndHyphenize(string input)
        {
            input = input.Trim().Replace(' ','-');
            input = input.ToLower();

            return new string(input
                .Normalize(System.Text.NormalizationForm.FormD)
                .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                .ToArray());
        }
    }
}
