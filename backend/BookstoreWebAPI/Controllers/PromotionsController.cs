using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using BookstoreWebAPI.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController(
        IPromotionRepository promotionRepository,
        ILogger<PromotionsController> logger,
        IValidator<QueryParameters> validator,
        IValidator<PromotionFilterModel> promoFilterValidator,
        UserContextService userContextService
    ) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromotionDTO>>> GetPromotionDTOsAsync(
            [FromQuery] QueryParameters queryParams,
            [FromQuery] PromotionFilterModel filter
        )
        {
            ValidationResult queryParamResult = await validator.ValidateAsync(queryParams);
            if (!queryParamResult.IsValid) return BadRequest(queryParamResult.Errors);

            ValidationResult filterModelResult = await promoFilterValidator.ValidateAsync(filter);
            if (!filterModelResult.IsValid) return BadRequest(filterModelResult.Errors);

            var promotions = await promotionRepository.GetPromotionDTOsAsync(queryParams, filter);
            int totalCount = promotionRepository.TotalCount;

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

        [HttpGet("{id}")]
        public async Task<ActionResult<PromotionDTO>> GetPromotionDTOByIdAsync(string id)
        {
            var promotion = await promotionRepository.GetPromotionDTOByIdAsync(id);

            if (promotion == null)
            {
                return NotFound();
            }

            return Ok(promotion);
        }

        [HttpPost]
        public async Task<ActionResult> CreatePromotionAsync([FromBody] PromotionDTO promotionDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            try
            {
                var createdPromotionDTO = await promotionRepository.AddPromotionDTOAsync(promotionDTO);

                return CreatedAtAction(
                    nameof(GetPromotionDTOByIdAsync), 
                    new { id = createdPromotionDTO.PromotionId }, 
                    createdPromotionDTO 
                );
            }
            catch (Exception ex)
            {
                logger.LogInformation(
                    $"Promotion Name: {promotionDTO.Name}" +
                    $"\nError message: {ex.Message}"
                );

                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePromotionAsync(string id, [FromBody] PromotionDTO promotionDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != promotionDTO.PromotionId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await promotionRepository.UpdatePromotionDTOAsync(promotionDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(
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
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (ids == null || ids.Length == 0)
            {
                return BadRequest("ids is required.");
            }

            var result = await promotionRepository.DeletePromotionDTOsAsync(ids);

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
