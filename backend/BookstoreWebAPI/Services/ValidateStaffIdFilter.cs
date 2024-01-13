using BookstoreWebAPI.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BookstoreWebAPI.Services
{
    public class ValidateStaffIdFilter : IAsyncActionFilter
    {
        private readonly IStaffRepository _staffRepository;

        public ValidateStaffIdFilter(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userIdClaim = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var staffId = userIdClaim.Value;
            var staff = await _staffRepository.GetStaffDTOByIdAsync(staffId);
            if (staff == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            await next();
        }
    }
}
