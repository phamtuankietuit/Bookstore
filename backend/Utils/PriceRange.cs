using System.Diagnostics.CodeAnalysis;

namespace SE100_BookstoreWebAPI.Utils
{
    public class PriceRange : IParsable<PriceRange>
    {
        public int? From { get; init; }
        public int? To { get; init; }

        public static PriceRange Parse(string value, IFormatProvider? provider)
        {
            if (!TryParse(value, provider, out var result))
            {
                throw new ArgumentException("Could not parse supplied value.", nameof(value));
            }

            return result;
        }

        public static bool TryParse([NotNullWhen(true)] string? value, IFormatProvider? provider, [MaybeNullWhen(false)] out PriceRange priceRange)
        {
            var segments = value?.Split(',', StringSplitOptions.RemoveEmptyEntries
                                       | StringSplitOptions.TrimEntries);

            if (segments?.Length == 2
                && int.TryParse(segments[0], provider, out var fromPrice)
                && int.TryParse(segments[1], provider, out var toPrice))
            {
                priceRange = new PriceRange { From = fromPrice, To = toPrice };
                return true;
            }

            priceRange = new PriceRange { From = default, To = default };
            return false;
        }
    }
}
