using BookstoreWebAPI.Enums;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.Documents;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IActivityLogRepository
    {
        public Dictionary<string, string> ActivityTypeWithNamePairs { get; }
        Task<int> GetTotalCount(QueryParameters queryParams, ActivityLogFilterModel filter);
        Task<IEnumerable<ActivityLogDTO>> GetActivityLogDTOsAsync(QueryParameters queryParams, ActivityLogFilterModel filter);
        Task<ActivityLogDTO?> GetActivityLogDTOByIdAsync(string id);
        Task<ActivityLogDTO> AddActivityLogDTOAsync(ActivityLogDTO activityLogDTO);
        string GetActivityName(string activityType, string objectName = "", string objectId = "");
        Task LogActivity(ActivityTypes activityType, string? staffId, string objectName="", string objectId="");
    }
}
