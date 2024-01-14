using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController(
        ILogger<ReportsController> logger,
        IReportRepository reportRepository,
        IValidator<ReportFilterModel> filterValidator
    ) : ControllerBase
    {
        [HttpGet("today")]
        public async Task<ActionResult> GetNumberOfOrderToday()
        {
            var result = await reportRepository.GetTodayOrderReport();

            return Ok(result);
        }

        [HttpGet("money")]
        public async Task<ActionResult> GetReportInformation(ReportFilterModel filter, string groupBy)
        {
            var filterResult = filterValidator.Validate(filter);

            if (!filterResult.IsValid) return BadRequest(filterResult.Errors);

            var result = await reportRepository.GetOrderReport(filter, groupBy);

            return Ok(result);
        }

        [HttpGet("orderCount")]
        public async Task<ActionResult> GetOrderCount(ReportFilterModel filter, string groupBy)
        {
            var filterResult = filterValidator.Validate(filter);

            if (!filterResult.IsValid) return BadRequest(filterResult.Errors);

            var result = await reportRepository.GetOrderCountReport(filter, groupBy);

            return Ok(result);
        }

        [HttpGet("topProducts")]
        public async Task<ActionResult> GetTop10SoldProducts(int? month, int? year)
        {
            if (month == null || year == null)
            {
                return BadRequest("Year and month is required");
            }

            var result = await reportRepository.GetTopSoldProducts(month.Value, year.Value);

            return Ok(result);
        }
    }
}
