using CosmosChangeFeedFunction.Repositories.Interfaces;
using Microsoft.Azure.Cosmos;

namespace CosmosChangeFeedFunction.Repositories
{
    public class StaffRepository : IStaffRepository
    {
        private Container _staffContainer;

        public StaffRepository(CosmosClient cosmosClient)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _staffContainer = cosmosClient.GetContainer(databaseName, "staffs");
        }
    }
}
