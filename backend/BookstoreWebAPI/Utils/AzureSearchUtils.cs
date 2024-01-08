using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using System.Text;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using System.Globalization;
using BookstoreWebAPI.Models.Documents;

namespace BookstoreWebAPI.Utils
{
    public class AzureSearchUtils
    {
        public static SearchOptions BuildOptions(QueryParameters queryParameters, CategoryFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, ProductFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, CustomerFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, PromotionFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, PurchaseOrderFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, SalesOrderFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, ActivityLogFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, SupplierFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, SupplierGroupFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }

        public static SearchOptions BuildOptions(QueryParameters queryParameters, StaffFilterModel filter)
        {
            var options = BuildBaseOptions(queryParameters);

            var filterQuery = BuildFilter(filter);
            options.Filter = filterQuery;

            return options;
        }


        private static SearchOptions BuildBaseOptions(QueryParameters queryParameters)
        {
            var options = new SearchOptions
            {
                QueryType = SearchQueryType.Full,
                IncludeTotalCount = true
            };

            if (queryParameters.PageSize != -1)
            {
                options.Size = queryParameters.PageSize;
                options.Skip = (queryParameters.PageNumber - 1) * queryParameters.PageSize;
            }

            options.OrderBy.Add($"{queryParameters.SortBy} {queryParameters.OrderBy}");

            return options;
        }

        private static string BuildFilter(CategoryFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);

            return query.ToString();
        }

        private static string BuildFilter(ProductFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }

        private static string BuildFilter(CustomerFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }

        private static string BuildFilter(PromotionFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }

        private static string BuildFilter(PurchaseOrderFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }

        private static string BuildFilter(SalesOrderFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }
        
        private static string BuildFilter(ActivityLogFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }
        
        private static string BuildFilter(SupplierFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }
        
        private static string BuildFilter(SupplierGroupFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }
        
        private static string BuildFilter(StaffFilterModel filter)
        {
            var query = new StringBuilder("ttl eq -1");

            AppendFilter(query, filter);


            return query.ToString();
        }



        private static void AppendFilter(StringBuilder query, CategoryFilterModel filter)
        {

        }

        private static void AppendFilter(StringBuilder query, ProductFilterModel filter)

        {
            if (!VariableHelpers.IsNull(filter.CategoryIds))
            {
                var categoryIds = string.Join(", ", filter.CategoryIds!.Select(id => $"{id}"));
                query.Append($" and search.in(categoryId, '{categoryIds}')");
            }

            if (!VariableHelpers.IsNull(filter.SupplierIds))
            {
                var supplierIds = string.Join(", ", filter.SupplierIds!.Select(id => $"{id}"));
                query.Append($" and search.in(supplierId, '{supplierIds}')");
            }

            if (!VariableHelpers.IsNull(filter.PriceRangeStrings))
            {
                var priceRangeConditions = filter.PriceRanges!
                    .Select(range => $"(salePrice ge {range.MinPrice} and salePrice le {range.MaxPrice})");

                var priceRangeQuery = string.Join(" or ", priceRangeConditions);
                query.Append($" and ({priceRangeQuery})");
            }

            if (!VariableHelpers.IsNull(filter.Manufacturers))
            {
                var manufacturers = string.Join(", ", filter.Manufacturers!.Select(m => $"{m}"));
                query.Append($" and search.in(details/manufacturer, '{manufacturers}')");
            }

            if (!VariableHelpers.IsNull(filter.AuthorIds))
            {
                var authors = string.Join(", ", filter.Authors!.Select(id => $"{id}"));
                query.Append($" and search.in(details/author, '{authors}')");
            }

            if (!VariableHelpers.IsNull(filter.PublisherIds))
            {
                var publishers = string.Join(", ", filter.Publishers!.Select(id => $"{id}"));
                query.Append($" and search.in(details/publisher, '{publishers}')");
            }

            AppendIsActiveFilter(query, filter.IsActive);
        }

        private static void AppendFilter(StringBuilder query, CustomerFilterModel filter)
        {
            AppendIsActiveFilter(query, filter.IsActive);
        }

        private static void AppendFilter(StringBuilder query, PromotionFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.Statuses))
            {
                var statuses = string.Join(", ", filter.Statuses!.Select(id => $"{id}"));
                query.Append($" and search.in(status, '{statuses}')");
            }

            if (!VariableHelpers.IsNull(filter.SalesOrderPrice))
            {
                query.Append($" and applyFromAmount le {filter.SalesOrderPrice}");

                // Since applyToAmount can be null, we only add this condition if applyToAmount is not null
                query.Append($" and (applyToAmount ge {filter.SalesOrderPrice} or applyToAmount eq null)");
            }

            if (!VariableHelpers.IsNull(filter.IsOutdated))
            {
                if (filter.IsOutdated == false)
                {
                    query.Append(" and closeAt ne null and closeAt gt now()");
                }
                else
                {
                    query.Append(" and closeAt ne null and closeAt le now()");
                }
            }
        }

        private static void AppendFilter(StringBuilder query, PurchaseOrderFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.SupplierIds))
            {
                var supplierIds = string.Join(", ", filter.SupplierIds!.Select(id => $"{id}"));
                query.Append($" and search.in(supplierId, '{supplierIds}')");
            }

            AppendCreationDateRangeFilter(query, filter.StartDate, filter.EndDate);

            if (!VariableHelpers.IsNull(filter.IsPaidOrder))
            {
                query.Append(" and paymentDetails ne null");

                if (filter.IsPaidOrder == true)
                {
                    query.Append(" and paymentDetails/status eq 'paid'");
                }
                else
                {
                    query.Append(" and paymentDetails/status ne 'paid'");
                }
            }
        }

        private static void AppendFilter(StringBuilder query, SalesOrderFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.CustomerIds))
            {
                var customerIds = string.Join(", ", filter.CustomerIds!.Select(id => $"{id}"));
                query.Append($" and search.in(customerId, '{customerIds}')");
            }

            AppendCreationDateRangeFilter(query, filter.StartDate, filter.EndDate);

            if (!VariableHelpers.IsNull(filter.StaffIds))
            {
                var staffIds = string.Join(", ", filter.StaffIds!.Select(id => $"{id}"));
                query.Append($" and search.in(staffId, '{staffIds}')");
            }
        }

        private static void AppendFilter(StringBuilder query, ActivityLogFilterModel filter)
        {
            AppendCreationDateRangeFilter(query, filter.StartDate, filter.EndDate);

            if (!VariableHelpers.IsNull(filter.StaffIds))
            {
                var staffIds = string.Join(", ", filter.StaffIds!.Select(id => $"{id}"));
                query.Append($" and search.in(staffId, '{staffIds}')");
            }

            if (!VariableHelpers.IsNull(filter.ActivityTypes))
            {
                var activityTypes = string.Join(", ", filter.ActivityTypes!.Select(id => $"{id}"));
                query.Append($" and search.in(activityType, '{activityTypes}')");
            }
        }

        private static void AppendFilter(StringBuilder query, SupplierFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.SupplierGroupIds))
            {
                var supplierGroupIds = string.Join(", ", filter.SupplierGroupIds!.Select(id => $"{id}"));
                query.Append($" and search.in(supplierGroupId, '{supplierGroupIds}')");
            }

            AppendIsActiveFilter(query, filter.IsActive);
        }

        private static void AppendFilter(StringBuilder query, SupplierGroupFilterModel filter)
        {
        }

        private static void AppendFilter(StringBuilder query, StaffFilterModel filter)
        {
            if (!VariableHelpers.IsNull(filter.Roles))
            {
                var roles = string.Join(", ", filter.Roles!.Select(id => $"\"{id}\""));
                query.Append($" and search.in(role, '{roles}')");
            }

            AppendIsActiveFilter(query, filter.IsActive);
        }


        private static void AppendIsActiveFilter(StringBuilder query, bool? isActive)
        {
            if (!VariableHelpers.IsNull(isActive))
            {
                query.Append($" and isActive eq {isActive.ToString()!.ToLower()}");
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

                query.Append($" and createdAt ge datetime'{isoStartDate}' and createdAt lt datetime'{isoEndDate}'");
            }
        }
    }
}
