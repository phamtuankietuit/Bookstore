using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;

namespace BookstoreWebAPI.Validators.FilterModels
{
    public class ProductFilterModelValidator : AbstractValidator<ProductFilterModel>
    {
        public ProductFilterModelValidator()
        {
            RuleFor(x => x.IsActiveString)
               .Custom((isActiveString, context) =>
               {
                   if (!string.IsNullOrEmpty(isActiveString) && !bool.TryParse(isActiveString, out var val))
                   {
                       context.AddFailure("IsActive has to be true or false");
                   }
               });
        }
    }
}
