using BookstoreWebAPI.Enums;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using System.Security.Authentication;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ILogger<AccountController> _logger;
        private readonly IAccountRepository _accountRepository;
        private readonly IActivityLogRepository _activityLogRepository;


        public AccountController(
            ILogger<AccountController> logger,
            IAccountRepository accountRepository,
            IActivityLogRepository activityLogRepository)
        {
            _logger = logger;
            _accountRepository = accountRepository;
            _activityLogRepository = activityLogRepository;
        }

        // GET: api/<AccountController>
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginModel data)
        {
            if (data == null || data.Password == null || data.Email == null)
            {
                return BadRequest();
            }

            try
            {
                AuthenticateResult result = await _accountRepository.AuthenticateUser(data);


                await _activityLogRepository.LogActivity(ActivityType.log_in, result.User.StaffId);

                return Ok(result);
            }
            catch (InvalidCredentialException)
            {
                return BadRequest("Invalid Credentials");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("updatePassword")]
        public async Task<IActionResult> UpdatePasswordAsync(UpdatePasswordModel data)
        {
            try
            {
                await _accountRepository.UpdatePasswordAsync(data);

                return NoContent();
            }
            catch (InvalidCredentialException)
            {
                return BadRequest("Invalid credentials.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
