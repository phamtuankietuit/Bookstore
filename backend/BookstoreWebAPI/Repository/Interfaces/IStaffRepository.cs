using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IStaffRepository
    {
        int TotalCount { get; }
        Task<IEnumerable<StaffDTO>> GetStaffDTOsAsync(QueryParameters queryParams, StaffFilterModel filter);
        Task<StaffDTO?> GetStaffDTOByIdAsync(string id);
        Task<StaffDTO> AddStaffDTOAsync(StaffDTO staffDTO);
        Task UpdateStaffDTOAsync(StaffDTO staffDTO);
        Task<BatchDeletionResult<StaffDTO>> DeleteStaffDTOsAsync(string[] ids);

        Task<StaffDocument?> GetStaffDocumentByEmailAsync(string email);
        Task UpdateForgotPasswordAsync(string email);
        Task<AuthenticateResult> GetStaffUsingCredentials(LoginModel data);
        Task UpdatePasswordAsync(UpdatePasswordModel data);
    }
}
