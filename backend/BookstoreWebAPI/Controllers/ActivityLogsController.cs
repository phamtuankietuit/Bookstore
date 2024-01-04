using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using FluentValidation.Results;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityLogsController : ControllerBase
    {
        private readonly ILogger<ActivityLogsController> _logger;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly IValidator<QueryParameters> _queryParametersValidator;
        private readonly IValidator<ActivityLogFilterModel> _activityLogFilterModelValidator;

        public ActivityLogsController(
            ILogger<ActivityLogsController> logger,
            IActivityLogRepository activityLogRepository,
            IValidator<QueryParameters> validator,
            IValidator<ActivityLogFilterModel> activityLogFilterModelValidator)
        {
            _logger = logger;
            _activityLogRepository = activityLogRepository;
            _queryParametersValidator = validator;
            _activityLogFilterModelValidator = activityLogFilterModelValidator;
        }

        // GET: api/<ActivityLogsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityLogDTO>>> GetActivityLogDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] ActivityLogFilterModel filter
        )
        {
            ValidationResult result = await _queryParametersValidator.ValidateAsync(queryParams);
            ValidationResult filterResult = await _activityLogFilterModelValidator.ValidateAsync(filter);
            
            if (!result.IsValid)
            {
                return BadRequest(result.Errors);
            }

            if (!filterResult.IsValid)
            {
                return BadRequest(filterResult.Errors);
            }

            int totalCount = await _activityLogRepository.GetTotalCount(queryParams, filter);
            var activityLogs = await _activityLogRepository.GetActivityLogDTOsAsync(queryParams, filter);

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

        // GET api/<ActivityLogsController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityLogDTO>> GetActivityLogDTOByIdAsync(string id)
        {
            var activityLog = await _activityLogRepository.GetActivityLogDTOByIdAsync(id);

            if (activityLog == null)
            {
                return NotFound();
            }

            return Ok(activityLog);
        }
    }
}
