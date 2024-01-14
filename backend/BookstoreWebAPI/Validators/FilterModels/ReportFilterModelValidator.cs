using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Utils;
using FluentValidation;

namespace BookstoreWebAPI.Validators.FilterModels
{
    public class ReportFilterModelValidator : AbstractValidator<ReportFilterModel>
    {
        public ReportFilterModelValidator()
        {
            RuleFor(x => x.StartDate)
                .Must(VariableHelpers.BeAValidDate)
                .When(x => x.StartDate.HasValue)
                .WithMessage("The StartDate field must be a valid date.");

            RuleFor(x => x.EndDate)
                .Must(VariableHelpers.BeAValidDate)
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
    }
}
