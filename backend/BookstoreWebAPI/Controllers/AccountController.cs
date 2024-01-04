using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Utils;
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


        public AccountController(
            ILogger<AccountController> logger,
            IAccountRepository accountRepository)
        {
            _logger = logger;
            _accountRepository = accountRepository;
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
                var result = await _accountRepository.AuthenticateUser(data);


                return Ok(new
                {
                    user = result.User,
                    token = result.Token
                });
            }
            catch(InvalidCredentialException)
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
