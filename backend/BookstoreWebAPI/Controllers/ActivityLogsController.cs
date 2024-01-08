using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityLogsController(
        IActivityLogRepository activityLogRepository,
        IValidator<QueryParameters> validator,
        IValidator<ActivityLogFilterModel> filterModelValidator
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityLogDTO>>> GetActivityLogDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] ActivityLogFilterModel filter
        )
        {
            ValidationResult queryParamResult = await validator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await filterModelValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);

            var activityLogs = await activityLogRepository.GetActivityLogDTOsAsync(queryParams, filter);
            int totalCount = activityLogRepository.TotalCount;

            if (activityLogs == null || !activityLogs.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = activityLogs,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityLogDTO>> GetActivityLogDTOByIdAsync(string id)
        {
            var activityLog = await activityLogRepository.GetActivityLogDTOByIdAsync(id);

            if (activityLog == null)
            {
                return NotFound();
            }

            return Ok(activityLog);
        }
    }
}
