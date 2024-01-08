using Azure.Search.Documents.Models;
using CosmosChangeFeedFunction.Models.Documents;
using CosmosChangeFeedFunction.Repositories.Interfaces;
using CosmosChangeFeedFunction.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CosmosChangeFeedFunction.Functions
{
    public class CFSupplierGroupFuntion(
        ILoggerFactory loggerFactory,
        ISupplierRepository supplierRepository,
        ISupplierGroupRepository supplierGroupRepository,
        AzureSearchClientFactory searchClientFactory
    )
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<CFSupplierGroupFuntion>();
        private readonly AzureSearchClientService _supplierSearchClientService = searchClientFactory.Create(indexName: "bookstore-suppliers-cosmosdb-index");
        private readonly AzureSearchClientService _supplierGroupSearchClientService = searchClientFactory.Create(indexName: "bookstore-suppliergroups-cosmosdb-index");


        [Function("CFSupplierGroupFuntion")]
        public async Task Run([CosmosDBTrigger(
            databaseName: "BookstoreDb",
            containerName: "supplierGroups",
            Connection = "CosmosDbConnectionString",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<SupplierGroup> input)
        {
            if (input != null && input.Count > 0)
            {
                var supplierGroupBatch = new IndexDocumentsBatch<SearchDocument>();
                var supplierBatch = new IndexDocumentsBatch<SearchDocument>();


                foreach (var updatedSupplierGroup in input)
                {
                    if (updatedSupplierGroup == null)
                        continue;

                    IEnumerable<Supplier>? updatedSuppliers = null;

                    // supg is going to be deleted
                    if (updatedSupplierGroup.IsDeleted && updatedSupplierGroup.TTL == -1)
                    {
                        _logger.LogInformation($"Deleting suppliergroup {updatedSupplierGroup.Name}");
                        await supplierRepository.ResetSupplierGroup(updatedSupplierGroup);

                        // perform a hard delete if you want
                        await supplierGroupRepository.DeleteSupplierGroupAsync(updatedSupplierGroup);

                        // call Delete if perform a hard delete
                        _supplierGroupSearchClientService.InsertToBatch(supplierGroupBatch, updatedSupplierGroup, BatchAction.Delete);

                    }
                    else if (!updatedSupplierGroup.IsDeleted)// supg is updated
                    {
                        _logger.LogInformation($"Updating suppliergroup {updatedSupplierGroup.Name}");

                        if (updatedSupplierGroup.CreatedAt != updatedSupplierGroup.ModifiedAt)
                        {
                            _logger.LogInformation($"[CFSupplierGroup] Updating supplierGroup id: {updatedSupplierGroup.Id}");

                            updatedSuppliers = await supplierRepository.UpdateSupplierGroup(updatedSupplierGroup);

                            _supplierGroupSearchClientService.InsertToBatch(supplierGroupBatch, updatedSupplierGroup, BatchAction.Merge);
                        }
                        else
                        {
                            _logger.LogInformation($"[CFSupplierGroup] Creating supplierGroup id: {updatedSupplierGroup.Id}");

                            _supplierGroupSearchClientService.InsertToBatch(supplierGroupBatch, updatedSupplierGroup, BatchAction.Upload);
                        }
                    }


                    if (updatedSuppliers != null)
                    {
                        foreach (var updatedSupplier in updatedSuppliers)
                        {
                            _supplierSearchClientService.InsertToBatch(supplierBatch, updatedSupplier, BatchAction.Merge);
                        }
                    }
                }


                await _supplierGroupSearchClientService.ExecuteBatchIndex(supplierGroupBatch);
                _logger.LogInformation($"[CFSupplierGroup] Executed batch supplierGroup, count: {supplierGroupBatch.Actions.Count}");

                await _supplierSearchClientService.ExecuteBatchIndex(supplierBatch);
                _logger.LogInformation($"[CFSupplierGroup] Executed batch supplier, count: {supplierBatch.Actions.Count}");

            }
        }
    }
}
