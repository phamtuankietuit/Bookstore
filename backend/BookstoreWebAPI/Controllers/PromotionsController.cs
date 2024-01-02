using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        private readonly ILogger<PromotionsController> _logger;
        private readonly IPromotionRepository _promotionRepository;

        public PromotionsController(ILogger<PromotionsController> logger, IPromotionRepository promotionRepository)
        {
            this._logger = logger;
            this._promotionRepository = promotionRepository;
        }

        // GET: api/<PromotionsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromotionDTO>>> GetPromotionDTOsAsync()
        {
            var promotions = await _promotionRepository.GetPromotionDTOsAsync();

            if (promotions == null || !promotions.Any())
            {
                return NotFound();
            }

            return Ok(promotions);
        }

        [HttpGet("newId")]
        public async Task<ActionResult<string>> GetNewPromotionIdAsync()
        {
            string newId = await _promotionRepository.GetNewPromotionIdAsync();

            return Ok(newId);
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
                await _promotionRepository.AddPromotionDTOAsync(promotionDTO);

                return Ok("Promotion created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the promotion. PromotionId: {promotionDTO.PromotionId}");
            }
        }

        // PUT api/<PromotionsController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePromotionAsync(string id, [FromBody] PromotionDTO promotionDTO)
        {
            try
            {
                await _promotionRepository.UpdatePromotionAsync(promotionDTO);

                return Ok("Promotion updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the promotion. PromotionId: {promotionDTO.PromotionId}");
            }
        }

        // DELETE api/<PromotionsController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePromotionAsync(string id)
        {
            try
            {
                await _promotionRepository.DeletePromotionAsync(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error message: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the promotion. PromotionId: {id}");
            }
        }
    }
}
