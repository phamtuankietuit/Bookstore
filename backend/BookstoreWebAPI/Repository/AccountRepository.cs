using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Models.Responses;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.DTOs;
using System.Security.Authentication;
using BookstoreWebAPI.Exceptions;

namespace BookstoreWebAPI.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountRepository> _logger;
        private readonly IStaffRepository _staffRepository;

        public AccountRepository(
            IConfiguration configuration,
            ILogger<AccountRepository> logger,
            IStaffRepository staffRepository)
        {
            _configuration = configuration;
            _logger = logger;
            _staffRepository = staffRepository;
        }

        public async Task<AuthenticateResult> AuthenticateUser(LoginModel data)
        {
            try
            {
                var user = await _staffRepository.GetStaffUsingCredentials(data);
                

                // If successful, generate a token
                var token = GenerateJwtToken(user);
                var result = new AuthenticateResult()
                {
                    User = user,
                    Token = token
                };

                return result;
            }
            catch (DocumentNotFoundException)
            {
                throw new InvalidCredentialException();
            }
            catch (InvalidCredentialException)
            {
                throw;
            }
        }

        public async Task UpdatePasswordAsync(UpdatePasswordModel data)
        {

            try
            {
                var staff = await _staffRepository.GetStaffUsingCredentials(new LoginModel() { Email = data.Email, Password = data.OldPassword });

                await _staffRepository.UpdatePasswordAsync(data);
            }
            catch (DocumentNotFoundException)
            {
                throw new InvalidCredentialException();
            }
            catch (InvalidCredentialException)
            {
                throw;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private string GenerateJwtToken(StaffDTO user)
        {
            var nowUtc = DateTime.UtcNow;
            var expirationDuration =
                TimeSpan.FromMinutes(10); // Adjust as needed
            var expirationUtc = nowUtc.Add(expirationDuration);

            var claims = new List<Claim>
                    {
                        new(JwtRegisteredClaimNames.Sub,
                            user.Contact.Email!),
                        new(JwtRegisteredClaimNames.Jti,
                            Guid.NewGuid().ToString()),
                        new(JwtRegisteredClaimNames.Iat,
                            EpochTime.GetIntDate(nowUtc).ToString(),
                            ClaimValueTypes.Integer64),
                        new(JwtRegisteredClaimNames.Exp,
                            EpochTime.GetIntDate(expirationUtc).ToString(),
                            ClaimValueTypes.Integer64),
                        new(JwtRegisteredClaimNames.Iss,
                            _configuration["JwtSecurityToken:Issuer"]!),
                        new(JwtRegisteredClaimNames.Aud,
                            _configuration["JwtSecurityToken:Audience"]!),
                        new("UserId", user.StaffId.ToString()),
                        new("Username", user.Contact.Email)
                    };

            var key = new SymmetricSecurityKey
            (Encoding.UTF8.GetBytes(_configuration["JwtSecurityToken:Key"]!));
            var signIn = new SigningCredentials
                         (key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSecurityToken:Issuer"],
                audience: _configuration["JwtSecurityToken:Audience"],
                claims: claims,
                expires: expirationUtc,
                signingCredentials: signIn);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }
    }
}
