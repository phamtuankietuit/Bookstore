using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using FluentValidation;
using BookstoreWebAPI.Repository;
using FluentValidation.Results;
using BookstoreWebAPI.Validators;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        private readonly ILogger<PromotionsController> _logger;
        private readonly IPromotionRepository _promotionRepository;
        private readonly IValidator<QueryParameters> _queryParametersValidator;
        private readonly IValidator<PromotionFilterModel> _filterValidator;

        public PromotionsController(
            IPromotionRepository promotionRepository,
            ILogger<PromotionsController> logger,
            IValidator<QueryParameters> validator,
            IValidator<PromotionFilterModel> promoFilterValidator)
        {
            _logger = logger;
            _promotionRepository = promotionRepository;
            _queryParametersValidator = validator;
            _filterValidator = promoFilterValidator;
        }

        // GET: api/<PromotionsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromotionDTO>>> GetPromotionDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] PromotionFilterModel filter
        )
        {
            ValidationResult queryParamResult = await _queryParametersValidator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await _filterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);

            var promotions = await _promotionRepository.GetPromotionDTOsAsync(queryParams, filter);
            int totalCount = _promotionRepository.TotalCount;

            if (promotions == null || !promotions.Any())
            {
                return NotFound();
            }

            return Ok(new
            {
                data = promotions,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        // GET api/<PromotionsController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PromotionDTO>> GetPromotionDTOByIdAsync(string id)
        {
            var promotion = await _promotionRepository.GetPromotionDTOByIdAsync(id);

            if (promotion == null)
            {
                return NotFound();
            }

            return Ok(promotion);
        }

        // POST api/<PromotionsController>
        [HttpPost]
        public async Task<ActionResult> CreatePromotionAsync([FromBody] PromotionDTO promotionDTO)
        {
            try
            {
                var createdPromotionDTO = await _promotionRepository.AddPromotionDTOAsync(promotionDTO);

                return CreatedAtAction(
                    nameof(GetPromotionDTOByIdAsync), // method
                    new { id = createdPromotionDTO.PromotionId }, // param in method
                    createdPromotionDTO // values returning after the route
                );
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    $"Promotion Name: {promotionDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        // PUT api/<PromotionsController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePromotionAsync(string id, [FromBody] PromotionDTO promotionDTO)
        {
            if (id != promotionDTO.PromotionId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await _promotionRepository.UpdatePromotionDTOAsync(promotionDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Updating failed. " +
                    $"\nPromotion Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the promotion. \n" +
                    $"Promotion Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        // DELETE api/<PromotionsController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePromotionsAsync(string[] ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("ids is required.");
            }

            var result = await _promotionRepository.DeletePromotionDTOsAsync(ids);

            int statusCount = 0;
            if (!result.IsNotSuccessful) statusCount++;
            if (!result.IsFound) statusCount++;
            if (!result.IsNotForbidden) statusCount++;

            if (statusCount > 1)
                return StatusCode(207, result.Responses);
            else if (!result.IsNotSuccessful) return NoContent();
            else if (!result.IsFound) return NotFound();

            return StatusCode(403);
        }
    }
}
