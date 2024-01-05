using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;
using System.Globalization;

namespace BookstoreWebAPI.Validators.FilterModels
{
    public class SalesOrderFilterModelValidator : AbstractValidator<SalesOrderFilterModel>
    {
        public SalesOrderFilterModelValidator()
        {
            RuleFor(x => x.StartDate)
                .Must(BeAValidDate)
                .When(x => x.StartDate.HasValue)
                .WithMessage("The StartDate field must be a valid date.");

            RuleFor(x => x.EndDate)
                .Must(BeAValidDate)
                .When(x => x.EndDate.HasValue)
                .WithMessage("The EndDate field must be a valid date.");

            RuleFor(x => x)
                .Custom((model, context) =>
                {
                    if (!model.StartDate.HasValue && model.EndDate.HasValue)
                    {
                        model.StartDate = model.EndDate;
                    }
                    else if (model.StartDate.HasValue && !model.EndDate.HasValue)
                    {
                        model.EndDate = model.StartDate;
                    }
                });
        }

        private bool BeAValidDate(DateTime? date)
        {
            return date != null && date != default(DateTime);
        }
    }
}
