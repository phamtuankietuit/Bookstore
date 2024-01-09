using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Repositories
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly Container _supplierContainer;
        private readonly ISupplierGroupRepository _supplierGroupRepository;
        private readonly ILogger _logger;

        public SupplierRepository(CosmosClient cosmosClient, ISupplierGroupRepository supplierGroupRepository, ILoggerFactory loggerFactory)
        {
            var databaseName = cosmosClient.ClientOptions.ApplicationName;

            _supplierContainer = cosmosClient.GetContainer(databaseName, "suppliers");
            _supplierGroupRepository = supplierGroupRepository;
            _logger = loggerFactory.CreateLogger<SupplierRepository>();
        }
        

        public async Task DeleteSupplierAsync(Supplier supplier)
        {
            List<PatchOperation> operations =
            [
                PatchOperation.Replace("/ttl", 1),
                PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
            ];

            await _supplierContainer.PatchItemAsync<Supplier>(supplier.Id, new PartitionKey(supplier.Id), operations);
        }

        public async Task<IEnumerable<Supplier>?> ResetSupplierGroup(SupplierGroup supplierGroup)
        {
            var supplierDocsToUpdate = await GetSuppliersInSupplierGroupAsync(supplierGroup.Id);

            if (supplierDocsToUpdate == null || !supplierDocsToUpdate.Any())
            {
                _logger.LogError($"No supplier belongs to supplier group id {supplierGroup.SupplierGroupId}");

                return null;
            }

            return await UpdateSupplierGroup("supg00000", supplierDocsToUpdate);
        }

        public async Task<IEnumerable<Supplier>?> UpdateSupplierGroup(SupplierGroup supplierGroup)
        {
            var supplierDocsToUpdate = await GetSuppliersInSupplierGroupAsync(supplierGroup.Id);

            if (supplierDocsToUpdate == null || !supplierDocsToUpdate.Any())
            {
                _logger.LogError($"No supplier belongs to supplier group id {supplierGroup.SupplierGroupId}");

                return null;
            }


            return await UpdateSupplierGroup(supplierGroup.Id, supplierDocsToUpdate);

        }

        public async Task<IEnumerable<Supplier>?> UpdateSupplierGroup(string supplierGroupId, IEnumerable<Supplier> supplierDocsToUpdate)
        {
            var SupplierGroupToUpdate = await _supplierGroupRepository.GetSupplierGroupByIdAsync(supplierGroupId);

            if (SupplierGroupToUpdate == null)
            {
                _logger.LogError($"SupplierGroup is null when collect to update product, id {supplierGroupId}");
                return null;
            }


            foreach (var supplierDoc in supplierDocsToUpdate)
            {
                List<PatchOperation> operations =
                [
                    PatchOperation.Replace("/supplierGroupId", SupplierGroupToUpdate.Id),
                    PatchOperation.Replace("/supplierGroupName", SupplierGroupToUpdate.Name),
                    PatchOperation.Replace("/modifiedAt", DateTime.UtcNow)
                ];

                await _supplierContainer.PatchItemAsync<SupplierGroup>(supplierDoc.Id, new PartitionKey(supplierDoc.Id), operations);
            }

            return supplierDocsToUpdate;
        }

        public async Task<Supplier?> GetSupplierByIdAsync(string supplierId)
        {
            var queryDef = new QueryDefinition(
                query:
                " SELECT * " +
                " FROM c " +
                " WHERE c.supplierId = @supplierId "
            ).WithParameter("@supplierId", supplierId);

            var supplier = await CosmosDbUtils.GetDocumentByQueryDefinition<Supplier>(_supplierContainer, queryDef);

            return supplier;
        }

        private async Task<IEnumerable<Supplier>?> GetSuppliersInSupplierGroupAsync(string supplierGroupId)
        {
            var queryDef = new QueryDefinition(
                query:
                    "SELECT * " +
                    " FROM c " +
                    " WHERE c.supplierGroupId = @supplierGroupId"    
            ).WithParameter("@supplierGroupId", supplierGroupId);

            var suppliers = await CosmosDbUtils.GetDocumentsByQueryDefinition<Supplier>(_supplierContainer, queryDef);

            return suppliers;
        }
    }
}
