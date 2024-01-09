using Azure.Search.Documents.Models;
using Azure.Search.Documents;
using Azure;

using Newtonsoft.Json;
using BookstoreWebAPI.Models.Responses;
using Azure.Core.Serialization;
using System.ComponentModel;

namespace BookstoreWebAPI.Services
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
        private readonly ILogger<AzureSearchClientService> _logger;

        public AzureSearchClientService(
            string serviceName,
            string indexName,
            string queryApiKey,
            ILogger<AzureSearchClientService> logger)
        {
            Uri serviceEndpoint = new($"https://{serviceName}.search.windows.net/");
            AzureKeyCredential credential = new(queryApiKey);

            _searchClient = new SearchClient(serviceEndpoint, indexName, credential);
            _logger = logger;
        }

        public async Task<SearchResults<T>> SearchAsync<T>(string searchText)
        {
            SearchOptions options = new()
            {
                IncludeTotalCount = true,
                Filter = $"search.ismatch('{searchText}')",
                OrderBy = { "search.score() desc" }
            };

            return await _searchClient.SearchAsync<T>(searchText, options);
        }

        public async Task<MySearchResult<TDocument>> SearchAsync<TDocument>(string searchText, SearchOptions options) where TDocument : class
        {
            MySearchResult<TDocument> mysearchResult = new()
            {
                Results = [],
                TotalCount = 0
            };

            if (!searchText.Contains(' ') && searchText != "*")
                searchText = "/.*" + searchText + ".*/";
            

            var searchResult = await _searchClient.SearchAsync<SearchDocument>(searchText, options);

            if (searchResult.Value != null)
                mysearchResult.TotalCount = Convert.ToInt32(searchResult.Value.TotalCount!.Value);

            mysearchResult.Results = searchResult.Value!.GetResults()
                .Select(result =>
                {
                    var json = JsonConvert.SerializeObject(result.Document);
                    return JsonConvert.DeserializeObject<TDocument>(json);
                })
                .ToList();

            return mysearchResult;
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

            largeBatch.Actions.Clear();
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
                _logger.LogInformation($"{property.Name}");
            }

            var searchDoc = new SearchDocument(objectDictionary);
            return searchDoc;
        }
    }
}
