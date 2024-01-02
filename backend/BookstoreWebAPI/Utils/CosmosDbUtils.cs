using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;
using System.Text;

namespace BookstoreWebAPI.Utils
{
    public class CosmosDbUtils
    {
        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id) ");
            AppendDeleteFilter(query, defaultSelect, isRemovableDocument);
            AppendQueryParameters(query, queryParams);

            var queryDef = new QueryDefinition(query.ToString());

            //if (!string.IsNullOrEmpty(queryParams.Search))
            //{
            //    // Add a generic way to include a search condition
            //    queryDef = queryDef.AddQueryOption("query", queryParams.Search);
            //}

            return queryDef;
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, ProductFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id) ");
            AppendDeleteFilter(query, defaultSelect, isRemovableDocument);
            AppendProductFilter(query, filter);
            AppendQueryParameters(query, queryParams);

            var queryDef = new QueryDefinition(query.ToString());

            return queryDef;

        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, PurchaseOrderFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id) ");
            AppendDeleteFilter(query, defaultSelect, isRemovableDocument);
            AppendPurchaseOrderFilter(query, filter);
            AppendQueryParameters(query, queryParams);

            var queryDef = new QueryDefinition(query.ToString());

            return queryDef;
        }

        private static void AppendDeleteFilter(StringBuilder query, string defaultSelect, bool isRemovableDocument)
        {
            if (isRemovableDocument)
            {
                query.Append(" AND c.isDeleted = false");
            }
        }

        public static void AddResponse<TDTO>(BatchDeletionResult<TDTO> batchDeletionResult, int responseOrder, TDTO responseData, int statusCode) where TDTO : class
        {
            var response = new ResponseWithStatus<TDTO>(id: responseOrder, status: statusCode, data: responseData);
            batchDeletionResult.Responses.Add(response);

            batchDeletionResult.IsSuccessful = (statusCode == 204);
            batchDeletionResult.IsForbidden = (statusCode == 403);
            batchDeletionResult.IsNotFound = (statusCode == 404);
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, SupplierFilterModel filter, string defaultSelect = "SELECT *") where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE c.isDeleted = false");

            AppendSupplierFilter(query, filter);
            AppendQueryParameters(query, queryParams);


            var queryDef = new QueryDefinition(query.ToString());
            //if (!string.IsNullOrEmpty(queryParams.Search))
            //{
            //    // Add a generic way to include a search condition
            //    queryDef = queryDef.AddQueryOption("query", queryParams.Search);
            //}

            return queryDef;

        }

        public static async Task<IEnumerable<TDocument>> GetDocumentsByQueryDefinition<TDocument>(Container container, QueryDefinition queryDefinition)
        {
            var results = new List<TDocument>();

            using var feed = container.GetItemQueryIterator<TDocument>(queryDefinition);

            double requestCharge = 0d;

            while (feed.HasMoreResults)
            {
                var response = await feed.ReadNextAsync();
                requestCharge += response.RequestCharge;

                results.AddRange(response);
            }

            //LogRequestCharged(requestCharge);

            return results;
        }

        public static async Task<TDocument?> GetDocumentByQueryDefinition<TDocument>(Container container, QueryDefinition queryDefinition)
        {
            using var feed = container.GetItemQueryIterator<TDocument>(
                queryDefinition: queryDefinition
            );

            FeedResponse<TDocument> response;
            
            if (feed.HasMoreResults)
            {
                response = await feed.ReadNextAsync();
                return response.FirstOrDefault();
            }

            //LogRequestCharged(response.RequestCharge);

            return default;
        }

        public static async Task<T?> GetScalarValueByQueryDefinition<T>(Container container, QueryDefinition queryDefinition)
        {
            using var feed = container.GetItemQueryIterator<T>(
                queryDefinition: queryDefinition
            );

            FeedResponse<T> response;

            if (feed.HasMoreResults)
            {
                response = await feed.ReadNextAsync();
                return response.FirstOrDefault();
            }

            //LogRequestCharged(response.RequestCharge);

            return default;
        }

        public static async Task<IEnumerable<T>?> GetScalarValuesByQueryDefinition<T>(Container container, QueryDefinition queryDefinition)
        {
            var results = new List<T>();

            using var feed = container.GetItemQueryIterator<T>(queryDefinition);

            double requestCharge = 0d;

            while (feed.HasMoreResults)
            {
                var response = await feed.ReadNextAsync();
                requestCharge += response.RequestCharge;

                results.AddRange(response);
            }

            //LogRequestCharged(requestCharge);

            return results;
        }

        private static void AppendProductFilter(StringBuilder query, ProductFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.CategoryIds))
            {
                var categoryIds = string.Join(", ", filter.CategoryIds!.Select(id => $"\"{id}\""));
                query.Append($" AND c.categoryId IN ({categoryIds})");
            }

            if (!VariableHelpers.IsNull(filter.SupplierIds))
            {
                var supplierIds = string.Join(", ", filter.SupplierIds!.Select(id => $"\"{id}\""));
                query.Append($" AND c.supplierId IN ({supplierIds})");
            }

            if (!VariableHelpers.IsNull(filter.PriceRangeStrings))
            {
                var priceRangeConditions = filter.PriceRanges!
                    .Select(range => $"(c.salePrice BETWEEN {range.MinPrice} AND {range.MaxPrice})");

                var priceRangeQuery = string.Join(" OR ", priceRangeConditions);
                query.Append($" AND ({priceRangeQuery})");
            }

            if (!VariableHelpers.IsNull(filter.Manufacturers))
            {
                var manufacturers = string.Join(", ", filter.Manufacturers!.Select(m => $"'{m}'"));
                query.Append($" AND c.details.manufacturer IN ({manufacturers})");
            }

            if (!VariableHelpers.IsNull(filter.AuthorIds))
            {
                var authors = string.Join(", ", filter.Authors!.Select(id => $"'{id}'"));
                query.Append($" AND c.details.author IN ({authors})");
            }

            if (!VariableHelpers.IsNull(filter.PublisherIds))
            {
                var publishers = string.Join(", ", filter.Publishers!.Select(id => $"'{id}'"));
                query.Append($" AND c.details.publisher IN ({publishers})");
            }

            if (!VariableHelpers.IsNull(filter.IsActives))
            {
                var isActives = string.Join(", ", filter.IsActives!.Select(a => $"'{a}'"));
                query.Append($" AND c.isActive IN ({isActives})");
            }
        }
        
        private static void AppendSupplierFilter(StringBuilder query, SupplierFilterModel filter)
        {
            if (!string.IsNullOrEmpty(filter.SupplierGroupId))
            {
                query.Append($" AND c.supplierGroupId = {filter.SupplierGroupId}");
            }

            if (!string.IsNullOrEmpty(filter.IsActive))
            {
                query.Append($" AND c.isActive = {filter.IsActive}");
            }
        }

        private static void AppendPurchaseOrderFilter(StringBuilder query, PurchaseOrderFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.SupplierIds))
            {
                var supplierIds = string.Join(", ", filter.SupplierIds!.Select(id => $"\"{id}\""));
                query.Append($" AND c.supplierId IN ({supplierIds})");
            }
        }

        private static void AppendQueryParameters(StringBuilder query, QueryParameters queryParameters)
        {
            if (!string.IsNullOrEmpty(queryParameters.SortBy) && !string.IsNullOrEmpty(queryParameters.OrderBy))
            {
                query.Append($" ORDER BY c.{queryParameters.SortBy} {queryParameters.OrderBy}");
            }

            if (queryParameters.PageSize != -1)
            {
                query.Append($" OFFSET {(queryParameters.PageNumber - 1) * queryParameters.PageSize} LIMIT {queryParameters.PageSize}");
            }
        }
    }
}
