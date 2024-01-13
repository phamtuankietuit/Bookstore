using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController(
        ILocationRepository locationRepository,
        UserContextService userContextService,
        ILogger<LocationsController> logger
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult> GetLocationsAsync()
        {
            var result = await locationRepository.GetLocationDTOsAsync();
            var totalCount = locationRepository.TotalCount;

            if (result == null || totalCount == 0)
                return NotFound();

            return Ok(new
            {
                data = result,
                metadata = new
                {
                    count = totalCount
                }
            });
        }

        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateLocation(string id, [FromBody] LocationDTO locationDTO)
        {
            var staffId = Request.Headers["staffId"].ToString();
            if (string.IsNullOrEmpty(staffId)) return Unauthorized();
            userContextService.Current.StaffId = staffId;

            if (id != locationDTO.LocationId)
            {
                return BadRequest("Specified id don't match with the DTO.");
            }

            try
            {

                await locationRepository.UpdateLocationDTO(locationDTO);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(
                    $"Updating failed. " +
                    $"\nLocation Id: {id}. " +
                    $"\nError message: {ex.Message}");

                return StatusCode(500,
                    $"An error occurred while updating the Location. \n" +
                    $"Location Id: {id}\n" +
                    $"Error message: {ex.Message}");
            }
        }

        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
