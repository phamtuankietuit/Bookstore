using Microsoft.AspNetCore.Mvc;
using BookstoreWebAPI.Enums;
using BookstoreWebAPI.Exceptions;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Repository.Interfaces;
using System.Security.Authentication;

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(
        ILogger<AccountController> logger,
        IAccountRepository accountRepository,
        IActivityLogRepository activityLogRepository
    ) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginModel data)
        {
            if (data == null || data.Password == null || data.Email == null)
            {
                return BadRequest();
            }

            try
            {
                AuthenticateResult result = await accountRepository.AuthenticateUser(data);

                await activityLogRepository.LogActivity(ActivityType.log_in, result.User.StaffId);

                return Ok(result);
            }
            catch (InvalidCredentialException)
            {
                return BadRequest("Invalid Credentials");
            }
            catch (AccountDisabledException)
            {
                return StatusCode(403, "Account is disabled");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("forgotPassword")]
        public async Task<ActionResult> ForgotPassword(BasePasswordModel data)
        {
            if (string.IsNullOrEmpty(data.Email))
            {
                return BadRequest();
            }

            try
            {
                await accountRepository.ForgotPasswordAsync(data.Email);

                return Ok();
            }
            catch (EmailNotFoundException ex)
            {
                return BadRequest(ex.Message);
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
                await accountRepository.UpdatePasswordAsync(data);

                return NoContent();
            }
            catch (InvalidCredentialException)
            {
                return BadRequest("Invalid credentials.");
            }
            catch (AccountDisabledException)
            {
                return StatusCode(403, "Account is disabled");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
