using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Responses;
using Microsoft.Azure.Cosmos;
using System.Globalization;
using System.Text;

namespace BookstoreWebAPI.Utils
{
    public class CosmosDbUtils
    {
        public static void AddResponse<TDTO>(BatchDeletionResult<TDTO> batchDeletionResult, int responseOrder, TDTO responseData, int statusCode) where TDTO : class
        {
            var response = new ResponseWithStatus<TDTO>(id: responseOrder, status: statusCode, data: responseData);
            batchDeletionResult.Responses.Add(response);

            switch (statusCode)
            {
                case 204:
                    batchDeletionResult.IsNotSuccessful = false;
                    break;
                case 403:
                    batchDeletionResult.IsNotForbidden = false;
                    break;
                case 404:
                    batchDeletionResult.IsFound = false;
                    break;
            }
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id) ");
            AppendDeleteFilter(query, isRemovableDocument);
            AppendQueryParameters(query, queryParams);

            QueryDefinition queryDef = BuildQueryDef(query);


            return queryDef;
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, AdjustmentTicketFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id) ");

            AppendDeleteFilter(query, isRemovableDocument);
            AppendQueryParameters(query, queryParams);

            QueryDefinition queryDef = BuildQueryDef(query);

            return queryDef;
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, ProductFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id) ");

            AppendDeleteFilter(query, isRemovableDocument);
            AppendProductFilter(query, filter);
            AppendQueryParameters(query, queryParams);

            QueryDefinition queryDef = BuildQueryDef(query);

            return queryDef;
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, PurchaseOrderFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id) ");

            AppendDeleteFilter(query, isRemovableDocument);
            AppendPurchaseOrderFilter(query, filter);
            AppendQueryParameters(query, queryParams);

            QueryDefinition queryDef = BuildQueryDef(query);

            return queryDef;
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, ActivityLogFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id) ");

            AppendActivityLogFilter(query, filter);
            AppendQueryParameters(query, queryParams);
            QueryDefinition queryDef = BuildQueryDef(query);


            return queryDef;
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, SupplierFilterModel filter, string defaultSelect = "SELECT *") where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id)");

            AppendSupplierFilter(query, filter);
            AppendQueryParameters(query, queryParams);
            QueryDefinition queryDef = BuildQueryDef(query);


            return queryDef;

        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, CustomerFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id)");

            AppendDeleteFilter(query, isRemovableDocument);
            AppendCustomerFilter(query, filter);
            AppendQueryParameters(query, queryParams);
            QueryDefinition queryDef = BuildQueryDef(query);


            return queryDef;
        }



        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, PromotionFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id)");

            AppendDeleteFilter(query, isRemovableDocument);
            AppendPromotionFilter(query, filter);
            AppendQueryParameters(query, queryParams);
            QueryDefinition queryDef = BuildQueryDef(query);


            return queryDef;
        }

        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, SalesOrderFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id)");
            AppendSalesOrderFilter(query, filter);
            AppendQueryParameters(query, queryParams);
            QueryDefinition queryDef = BuildQueryDef(query);
            return queryDef;
        }
        
        public static QueryDefinition BuildQuery<T>(QueryParameters queryParams, StaffFilterModel filter, string defaultSelect = "SELECT *", bool isRemovableDocument = true) where T : class
        {
            var query = new StringBuilder($"{defaultSelect} FROM c WHERE ISDEFINED(c.id)");

            AppendDeleteFilter(query, isRemovableDocument);
            AppendStaffFilter(query, filter);
            AppendQueryParameters(query, queryParams);
            QueryDefinition queryDef = BuildQueryDef(query);
            return queryDef;
        }

        

        private static QueryDefinition BuildQueryDef(StringBuilder query)
        {

            // avoid sql injection
            query = query.Replace(";", "");
            return new QueryDefinition(query.ToString());
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

        private static void AppendDeleteFilter(StringBuilder query, bool isRemovableDocument)
        {
            if (isRemovableDocument)
            {
                query.Append(" and c.isDeleted = false");
            }
        }

        private static void AppendProductFilter(StringBuilder query, ProductFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.CategoryIds))
            {
                var categoryIds = string.Join(", ", filter.CategoryIds!.Select(id => $"\"{id}\""));
                query.Append($" and c.categoryId IN ({categoryIds})");
            }

            if (!VariableHelpers.IsNull(filter.SupplierIds))
            {
                var supplierIds = string.Join(", ", filter.SupplierIds!.Select(id => $"\"{id}\""));
                query.Append($" and c.supplierId IN ({supplierIds})");
            }

            if (!VariableHelpers.IsNull(filter.PriceRangeStrings))
            {
                var priceRangeConditions = filter.PriceRanges!
                    .Select(range => $"(c.salePrice BETWEEN {range.MinPrice} and {range.MaxPrice})");

                var priceRangeQuery = string.Join(" OR ", priceRangeConditions);
                query.Append($" and ({priceRangeQuery})");
            }

            if (!VariableHelpers.IsNull(filter.Manufacturers))
            {
                var manufacturers = string.Join(", ", filter.Manufacturers!.Select(m => $"'{m}'"));
                query.Append($" and c.details.manufacturer IN ({manufacturers})");
            }

            if (!VariableHelpers.IsNull(filter.AuthorIds))
            {
                var authors = string.Join(", ", filter.Authors!.Select(id => $"'{id}'"));
                query.Append($" and c.details.author IN ({authors})");
            }

            if (!VariableHelpers.IsNull(filter.PublisherIds))
            {
                var publishers = string.Join(", ", filter.Publishers!.Select(id => $"'{id}'"));
                query.Append($" and c.details.publisher IN ({publishers})");
            }

            AppendIsActiveFilter(query, filter.IsActive);
        }



        private static void AppendSupplierFilter(StringBuilder query, SupplierFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.SupplierGroupIds))
            {
                var supplierGroupIds = string.Join(", ", filter.SupplierGroupIds!.Select(id => $"\"{id}\""));
                query.Append($" and c.supplierGroupId IN ({supplierGroupIds})");
            }

            AppendIsActiveFilter(query, filter.IsActive);
        }

        private static void AppendPurchaseOrderFilter(StringBuilder query, PurchaseOrderFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.SupplierIds))
            {
                var supplierIds = string.Join(", ", filter.SupplierIds!.Select(id => $"\"{id}\""));
                query.Append($" and c.supplierId IN ({supplierIds})");
            }

            AppendCreationDateRangeFilter(query, filter.StartDate, filter.EndDate);

            if (!VariableHelpers.IsNull(filter.IsPaidOrder))
            {
                query.Append(" and (NOT IS_NULL(c.paymentDetails)");

                if (filter.IsPaidOrder == true)
                {
                    query.Append(" and STRINGEQUALS(c.paymentDetails.status, 'paid'))");
                }
                else
                {
                    query.Append(" and (NOT STRINGEQUALS(c.paymentDetails.status, 'paid')))");
                }
            }
        }

        private static void AppendPromotionFilter(StringBuilder query, PromotionFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.Statuses))
            {
                var statuses = string.Join(", ", filter.Statuses!.Select(id => $"\"{id}\""));
                query.Append($" and c.status IN ({statuses})");
            }

            if (!VariableHelpers.IsNull(filter.SalesOrderPrice))
            {
                query.Append($" and c.applyFromAmount <= {filter.SalesOrderPrice}");

                // Since applyToAmount can be null, we only add this condition if applyToAmount is not null
                query.Append($" and (c.applyToAmount >= {filter.SalesOrderPrice} OR c.applyToAmount = null)");
            }

            if (!VariableHelpers.IsNull(filter.IsOutdated))
            {
                if (filter.IsOutdated == false)
                {
                    query.Append(" and (NOT IS_NULL(c.closeAt) and c.closeAt > GetCurrentDateTime())");
                }
                else
                {
                    query.Append(" and (NOT IS_NULL(c.closeAt) and c.closeAt <= GetCurrentDateTime())");
                }
            }
        }

        private static void AppendSalesOrderFilter(StringBuilder query, SalesOrderFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.CustomerIds))
            {
                var customerIds = string.Join(", ", filter.CustomerIds!.Select(id => $"\"{id}\""));
                query.Append($" and c.customerId IN ({customerIds})");
            }

            AppendCreationDateRangeFilter(query, filter.StartDate, filter.EndDate);

            if (!VariableHelpers.IsNull(filter.StaffIds))
            {
                var customerIds = string.Join(", ", filter.StaffIds!.Select(id => $"\"{id}\""));
                query.Append($" and c.staffId IN ({customerIds})");
            }
        }
        private static void AppendCustomerFilter(StringBuilder query, CustomerFilterModel filter)
        {
            AppendIsActiveFilter(query, filter.IsActive);
        }

        private static void AppendActivityLogFilter(StringBuilder query, ActivityLogFilterModel filter)
        {
            AppendCreationDateRangeFilter(query, filter.StartDate, filter.EndDate);

            if (!VariableHelpers.IsNull(filter.StaffIds))
            {
                var staffIds = string.Join(", ", filter.StaffIds!.Select(id => $"\"{id}\""));
                query.Append($" and c.staffId IN ({staffIds})");
            }

            if (!VariableHelpers.IsNull(filter.ActivityTypes))
            {
                var activityTypes = string.Join(", ", filter.ActivityTypes!.Select(id => $"\"{id}\""));
                query.Append($" and c.activityType IN ({activityTypes})");
            }
        }

        private static void AppendStaffFilter(StringBuilder query, StaffFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.Roles))
            {
                var roles = string.Join(", ", filter.Roles!.Select(id => $"\"{id}\""));
                query.Append($" and c.role IN ({roles})");
            }

            AppendIsActiveFilter(query, filter.IsActive);
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


        private static void AppendCreationDateRangeFilter(StringBuilder query, DateTime? startDate, DateTime? endDate)
        {
            if (!VariableHelpers.IsNull(startDate) && !VariableHelpers.IsNull(endDate))
            {
                var startDateTemp = startDate!.Value.Date;
                var endDateTemp = endDate!.Value.Date.AddDays(1); // Add one day to include the end date
                var isoStartDate = startDateTemp.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
                var isoEndDate = endDateTemp.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

                query.Append($" and c.createdAt >= '{isoStartDate}' and c.createdAt < '{isoEndDate}'");
            }
        }

        private static void AppendIsActiveFilter(StringBuilder query, bool? isActive)
        {
            if (!VariableHelpers.IsNull(isActive))
            {
                query.Append($" and c.isActive = {isActive.ToString()!.ToLower()}");
            }
        }
    }
}
