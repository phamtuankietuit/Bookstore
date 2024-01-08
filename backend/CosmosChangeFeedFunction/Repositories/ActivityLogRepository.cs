using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Repositories
{
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly Container _activityLogContainer;
        private readonly ILogger _logger;

        public ActivityLogRepository(CosmosClient cosmosClient, ILoggerFactory loggerFactory)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _activityLogContainer = cosmosClient.GetContainer(databaseName, "activityLogs");
            _logger = loggerFactory.CreateLogger<ActivityLogRepository>();
        }

        public async Task<IEnumerable<ActivityLog>?> UpdateStaffInfoAsync(Staff updatedStaff)
        {
            var activityLogs = await GetActivityLogsByStaffIdAsync(updatedStaff.StaffId);

            if (activityLogs == null)
            {
                _logger.LogError($"No activity logs found for staff id {updatedStaff.StaffId}");

                return null;
            }


            foreach (var activityLog in activityLogs)
            {
                List<PatchOperation> operations =
                [
                    PatchOperation.Replace("/staffName", updatedStaff.Name),
                    PatchOperation.Replace("/modifiedAt", DateTime.UtcNow),
                ];

                await _activityLogContainer.PatchItemAsync<ActivityLog>(activityLog.Id, new PartitionKey(activityLog.StaffId), operations);
            }

            return activityLogs;
        }

        public async Task<IEnumerable<ActivityLog>?> GetActivityLogsByStaffIdAsync(string staffId)
        {
            var queryDef = new QueryDefinition(
                query:
                " SELECT * " +
                " FROM c " +
                " WHERE c.staffId = @staffId"
            ).WithParameter("@staffId", staffId);

            var activityLogs = await CosmosDbUtils.GetDocumentsByQueryDefinition<ActivityLog>(_activityLogContainer, queryDef);

            return activityLogs;
        }
    }
}
