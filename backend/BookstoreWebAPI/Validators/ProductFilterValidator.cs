using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;

namespace BookstoreWebAPI.Validators
{
    public class ProductFilterValidator : AbstractValidator<ProductFilterModel>
    {
        public ProductFilterValidator()
        {
        }
    }
}
