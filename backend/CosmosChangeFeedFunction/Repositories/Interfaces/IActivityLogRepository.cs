using CosmosChangeFeedFunction.Models.Documents;

namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public  interface IActivityLogRepository
    {
        Task<IEnumerable<ActivityLog>?> UpdateStaffInfoAsync(Staff updatedStaff);
    }
}
