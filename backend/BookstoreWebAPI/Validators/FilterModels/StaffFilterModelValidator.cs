using BookstoreWebAPI.Enums;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;

namespace BookstoreWebAPI.Validators.FilterModels
{
    public class StaffFilterModelValidator : AbstractValidator<StaffFilterModel>
    {
        public StaffFilterModelValidator()
        {
            RuleFor(x => x.IsActiveString)
                .Custom((isActiveString, context) =>
                {
                    if (!string.IsNullOrEmpty(isActiveString) && !bool.TryParse(isActiveString, out var val))
                    {
                        context.AddFailure("IsActive has to be true or false");
                    }
                });

            RuleForEach(x => x.Roles)
                .Custom((role, context) =>
                {
                    if (!string.IsNullOrEmpty(role) && !Enum.IsDefined(typeof(StaffRole), role))
                    {
                        context.AddFailure($"Role '{role}' is not valid. It must be one of the following: {string.Join(", ", Enum.GetNames(typeof(StaffRole)))}");
                    }
                });
        }
    }
}
