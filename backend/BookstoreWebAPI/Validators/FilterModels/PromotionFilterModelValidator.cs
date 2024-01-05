using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;

namespace BookstoreWebAPI.Validators.FilterModels
{
    public class PromotionFilterModelValidator : AbstractValidator<PromotionFilterModel>
    {
        public PromotionFilterModelValidator()
        {
            RuleFor(x => x.IsOutdatedString)
                .Custom((isOutdatedString, context) =>
                {
                    if (!string.IsNullOrEmpty(isOutdatedString) && !bool.TryParse(isOutdatedString, out var val))
                    {
                        context.AddFailure("IsOutdated has to be true or false");
                    }
                });
        }
    }
}
