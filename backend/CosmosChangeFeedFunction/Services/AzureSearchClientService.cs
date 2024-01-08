using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Microsoft.Extensions.Logging;
using System.ComponentModel;

namespace CosmosChangeFeedFunction.Services
{
    public enum BatchAction
    {
        Merge,
        Upload,
        Delete,
        MergeOrUpload
    };

    public class AzureSearchClientService
    {
        private readonly SearchClient _searchClient;
        private readonly ILogger _logger;

        public AzureSearchClientService(ILoggerFactory loggerFactory, string serviceName, string indexName, string adminApiKey)
        {
            Uri endpoint = new Uri($"https://{serviceName}.search.windows.net");
            AzureKeyCredential adminCredential = new(adminApiKey);
            _searchClient = new(endpoint, indexName, adminCredential);

            _logger = loggerFactory.CreateLogger<AzureSearchClientService>();
        }

        public async Task ExecuteBatchIndex(IndexDocumentsBatch<SearchDocument> largeBatch)
        {
            const int BatchSizeLimit = 900;
            var allActions = largeBatch.Actions.ToList();

            while (allActions.Count > 0)
            {
                var batchActions = allActions.Take(BatchSizeLimit).ToList();
                var batch = IndexDocumentsBatch.Create(batchActions.ToArray());

                try
                {
                    await _searchClient.IndexDocumentsAsync(batch);

                }
                catch (RequestFailedException ex)
                {
                    Console.WriteLine($"Failed to index batch: {ex.Message}");
                }

                allActions = allActions.Skip(BatchSizeLimit).ToList();
            }

            //var result = await _searchClient.IndexDocumentsAsync(largeBatch);

            //var response = result.GetRawResponse();

            //return response.Status;
        }

        public void InsertToBatch<T>(IndexDocumentsBatch<SearchDocument> batch, T updatedObject, BatchAction batchAction) where T : class
        {
            SearchDocument searchDoc = SerializeObjectToSearchDoc(updatedObject);

            // Add the document to the batch of actions
            switch (batchAction)
            {
                case BatchAction.Merge:
                    batch.Actions.Add(IndexDocumentsAction.Merge(searchDoc));
                    break;
                case BatchAction.Upload:
                    batch.Actions.Add(IndexDocumentsAction.Upload(searchDoc));
                    break;
                case BatchAction.MergeOrUpload:
                    batch.Actions.Add(IndexDocumentsAction.MergeOrUpload(searchDoc));
                    break;
                case BatchAction.Delete:
                    batch.Actions.Add(IndexDocumentsAction.Delete(searchDoc));
                    break;
            }
        }

        private SearchDocument SerializeObjectToSearchDoc<T>(T updatedObject) where T : class
        {
            Dictionary<string, object?> objectDictionary = [];

            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(updatedObject))
            {
                objectDictionary.Add(property.Name, property.GetValue(updatedObject));
            }

            var searchDoc = new SearchDocument(objectDictionary);
            return searchDoc;
        }
    }
}
