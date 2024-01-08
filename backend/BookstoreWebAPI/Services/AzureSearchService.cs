using Azure.Search.Documents.Models;
using Azure.Search.Documents;
using Azure;

using Newtonsoft.Json;
using BookstoreWebAPI.Models.Responses;

namespace BookstoreWebAPI.Services
{
    public class AzureSearchService
    {
        private SearchClient _searchClient;
        private HttpClient _httpClient;

        public AzureSearchService(string serviceName, string indexName, string queryApiKey)
        {
            Uri serviceEndpoint = new Uri($"https://{serviceName}.search.windows.net/");
            AzureKeyCredential credential = new AzureKeyCredential(queryApiKey);

            _searchClient = new SearchClient(serviceEndpoint, indexName, credential);
            //_httpClient = httpClient;
        }

        public async Task<SearchResults<T>> SearchAsync<T>(string searchText)
        {
            SearchOptions options = new SearchOptions()
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
                Results = new List<TDocument?>(),
                TotalCount = 0
            };

            if (!searchText.Contains(" ") && searchText != "*")
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
    }
}
