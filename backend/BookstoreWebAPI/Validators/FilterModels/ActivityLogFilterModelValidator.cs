using BookstoreWebAPI.Enums;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;

namespace BookstoreWebAPI.Validators.FilterModels
{
    public class ActivityLogFilterModelValidator : AbstractValidator<ActivityLogFilterModel>
    {
        public ActivityLogFilterModelValidator()
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

            RuleFor(filter => filter.ActivityTypes)
                .Must(BeValidActivityTypes!)
                .WithMessage("Invalid activity type.")
                .When(filter => filter.ActivityTypes != null && filter.ActivityTypes.Any());
        }

        private bool BeValidActivityTypes(IEnumerable<string> activityTypes)
        {
            var validActivityTypes = Enum.GetNames(typeof(ActivityType));
            return activityTypes.All(at => validActivityTypes.Contains(at));
        }

        private bool BeAValidDate(DateTime? date)
        {
            return date != null && date != default(DateTime);
        }
    }
}
