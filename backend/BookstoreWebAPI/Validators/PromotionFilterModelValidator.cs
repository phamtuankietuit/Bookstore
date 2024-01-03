using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;

namespace BookstoreWebAPI.Validators
{
    public class PromotionFilterModelValidator :AbstractValidator<PromotionFilterModel>
    {
        public PromotionFilterModelValidator()
        {
            RuleFor(x => x.IsOutdatedString)
                .Custom((isOutdatedString, context) =>
                {
                    if (!string.IsNullOrEmpty(isOutdatedString) && isOutdatedString.ToLower() != "true" && isOutdatedString.ToLower() != "false")
                    {
                        context.AddFailure("IsOutdated has to be true or false");
                    }
                });
        }
    }
}
