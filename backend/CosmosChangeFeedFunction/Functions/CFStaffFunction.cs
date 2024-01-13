using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFStaffFunction(
        ILoggerFactory loggerFactory,
        IActivityLogRepository activityLogRepository,
        AzureSearchClientFactory searchClientFactory
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFStaffFunction>();
        private readonly AzureSearchClientService _staffSearchClientService = searchClientFactory.Create("bookstore-staffs-cosmosdb-index");
        private readonly AzureSearchClientService _activityLogSearchClientService = searchClientFactory.Create(indexName: "bookstore-activityLogs-cosmosdb-index");


        [Function("CFStaffFunction")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "staffs",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<Staff> input)
        {
            if (input != null && input.Count > 0)
            {
                var staffBatch = new IndexDocumentsBatch<SearchDocument>();
                var activityLogBatch = new IndexDocumentsBatch<SearchDocument>();


                foreach (var updatedStaff in input)
                {
                    if (updatedStaff == null)
                        continue;

                    // update staff inside activityLog and adjustment ticket (not dev)

                    IEnumerable<ActivityLog>? updatedActivityLogs = null;

                    if (updatedStaff.IsDeleted && updatedStaff.TTL == -1)
                    {
                        _logger.LogInformation($"[CFStaff] Deleting staff id: {updatedStaff.Id}");
                        // perform a hard delete if you want - remember to call searchclient to delete from index

                        // call Merge if perform soft delete
                        //_staffSearchClientService.InsertToBatch(staffBatch, updatedStaff, BatchAction.Merge);
                    }
                    else if (!updatedStaff.IsDeleted)
                    {
                        if (updatedStaff.CreatedAt != updatedStaff.ModifiedAt)
                        {
                            _logger.LogInformation($"[CFStaff] Updating staff id: {updatedStaff.Id}");

                            updatedActivityLogs = await activityLogRepository.UpdateStaffInfoAsync(updatedStaff);

                            //_staffSearchClientService.InsertToBatch(staffBatch, updatedStaff, BatchAction.Merge);
                        }
                        else
                        {
                            _logger.LogInformation($"[CFStaff] Creating staff id: {updatedStaff.Id}");

                        }
                    }


                    if (updatedActivityLogs != null)
                    {
                        foreach (var updatedActivityLog in updatedActivityLogs)
                        {
                            _activityLogSearchClientService.InsertToBatch(activityLogBatch, updatedActivityLog, BatchAction.Merge);
                        }
                    }
                    
                    
                    _staffSearchClientService.InsertToBatch(staffBatch, updatedStaff, BatchAction.MergeOrUpload);
                }

                await _staffSearchClientService.ExecuteBatchIndex(staffBatch);
                _logger.LogInformation($"[CFStaff] Executed batch staff, count: {staffBatch.Actions.Count}");

                await _activityLogSearchClientService.ExecuteBatchIndex(activityLogBatch);
                _logger.LogInformation($"[CFStaff] Executed batch activityLog, count: {activityLogBatch.Actions.Count}");
            }
        }
    }

}
