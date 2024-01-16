using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Repository.Interfaces;
using BookstoreWebAPI.Models.DTOs;
using BookstoreWebAPI.Models.Documents;

namespace BookstoreWebAPI.Repository
{
    public class ReportRepository : IReportRepository
    {
        private readonly ISalesOrderRepository salesOrderRepository;
        private readonly IReturnOrderRepository returnOrderRepository;
        private readonly IPurchaseOrderRepository purchaseOrderRepository;

        public ReportRepository(ISalesOrderRepository salesOrderRepository, IReturnOrderRepository returnOrderRepository, IPurchaseOrderRepository purchaseOrderRepository)
        {
            this.salesOrderRepository = salesOrderRepository;
            this.returnOrderRepository = returnOrderRepository;
            this.purchaseOrderRepository = purchaseOrderRepository;
        }

        public async Task<dynamic> GetTodayOrderReport()
        {
            var today = DateTime.Today;
            var yesterday = today.AddDays(-1);

            var todayOrders = await GetOrders(today, today);
            var yesterdayOrders = await GetOrders(yesterday, yesterday);

            var todayRevenue = todayOrders.Sum(order => order.TotalAmount);
            var yesterdayRevenue = yesterdayOrders.Sum(order => order.TotalAmount);

            var todayInvest = await GetInvest(todayOrders);
            var yesterdayInvest = await GetInvest(yesterdayOrders);

            var todayProfit = todayRevenue - todayInvest;
            var yesterdayProfit = yesterdayRevenue - yesterdayInvest;

            double countPercent = CalculatePercent(todayOrders.Count, yesterdayOrders.Count);
            double revenuePercent = CalculatePercent(todayRevenue, yesterdayRevenue);
            double investPercent = CalculatePercent(todayInvest, yesterdayInvest);
            double profitPercent = CalculatePercent(todayProfit, yesterdayProfit);

            return new
            {
                count = todayOrders.Count,
                countPercent = string.Format("{0:0.00}", countPercent),
                revenue = todayRevenue,
                revenuePercent = string.Format("{0:0.00}", revenuePercent),
                profit = todayProfit,
                profitPercent = string.Format("{0:0.00}", profitPercent),
            };
        }

        public async Task<dynamic> GetOrderReport(ReportFilterModel filter, string groupBy)
        {
            var startDate = filter.StartDate!.Value;
            var endDate = filter.EndDate!.Value;

            var dateRange = GenerateDateRange(startDate, endDate, groupBy);

            var dates = new List<string>();
            var revenues = new List<double>();
            var profits = new List<double>();
            var invests = new List<double>();

            foreach (var date in dateRange)
            {
                var orders = await GetOrders(date.Item1, date.Item2);
                var revenue = orders.Sum(order => order.TotalAmount);
                var invest = await GetInvest(orders);
                var profit = revenue - invest;

                dates.Add(date.Item1.ToString(groupBy == "year" ? "yyyy" : groupBy == "month" ? "MM/yyyy": "dd/MM/yyyy"));
                revenues.Add(revenue);
                profits.Add(profit);
                invests.Add(invest);
            }

            return new
            {
                dates,
                revenues,
                profits,
                invests
            };
        }

        public async Task<dynamic> GetOrderCountReport(ReportFilterModel filter, string groupBy)
        {
            var startDate = filter.StartDate!.Value;
            var endDate = filter.EndDate!.Value;

            var dateRange = GenerateDateRange(startDate, endDate, groupBy);

            var dates = new List<string>();
            var orderCounts = new List<double>();

            foreach (var date in dateRange)
            {
                var orders = await GetOrders(date.Item1, date.Item2);
                var orderCount = orders.Count;

                dates.Add(date.Item1.ToString(groupBy == "year" ? "yyyy" : groupBy == "month" ? "MM/yyyy" : "dd/MM/yyyy"));
                orderCounts.Add(orderCount);
            }

            return new
            {
                dates,
                orderCounts
            };
        }

        public async Task<dynamic> GetTopSoldProducts(int month, int year)
        {
            var startDate = new DateTime(year, month, 1);
            var endDateOfMonth = startDate.AddDays(DateTime.DaysInMonth(startDate.Year, startDate.Month));
            DateTime endDate;
            if (endDateOfMonth > DateTime.UtcNow)
            {
                endDate = DateTime.UtcNow.AddDays(1);
            }
            else
            {
                endDate = endDateOfMonth;
            }

            var orders = await GetOrders(startDate, endDate);

            var currentMonth = DateTime.UtcNow.Month;
            var currentYear = DateTime.UtcNow.Year;

            var topProducts = orders
                // Flatten the items
                .SelectMany(order => order.Items)
                // Group by product id
                .GroupBy(item => item.ProductId)
                // Select product id and total quantity
                .Select(group => new { ProductId = group.Key, Quantity = group.Sum(item => item.Quantity) })
                // Order by quantity descending
                .OrderByDescending(product => product.Quantity)
                // Take top 10
                .Take(10)
                // To list
                .ToList();

            var products = topProducts.Select(p => p.ProductId).ToList();
            var quantities = topProducts.Select(p => p.Quantity).ToList();

            return new { products, quantities };
        }

        private List<Tuple<DateTime, DateTime>> GenerateDateRange(DateTime startDate, DateTime endDate, string groupBy)
        {
            var dateRange = new List<Tuple<DateTime, DateTime>>();

            switch (groupBy.ToLower())
            {
                case "day":
                    for (var date = startDate; date <= endDate; date = date.AddDays(1))
                    {
                        dateRange.Add(Tuple.Create(date, date));
                    }
                    break;
                case "month":
                    for (var date = new DateTime(startDate.Year, startDate.Month, 1); date <= endDate; date = date.AddMonths(1))
                    {
                        var endOfMonth = new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month));
                        if (endOfMonth > endDate) endOfMonth = endDate;
                        dateRange.Add(Tuple.Create(date, endOfMonth));
                    }
                    break;
                case "year":
                    for (var date = new DateTime(startDate.Year, 1, 1); date <= endDate; date = date.AddYears(1))
                    {
                        var endOfYear = new DateTime(date.Year, 12, 31);
                        if (endOfYear > endDate) endOfYear = endDate;
                        dateRange.Add(Tuple.Create(date, endOfYear));
                    }
                    break;
            }

            return dateRange;
        }

        private async Task<List<SalesOrderDTO>> GetOrders(DateTime startDate, DateTime endDate)
        {
            QueryParameters queryParameters = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = -1
            };

            SalesOrderFilterModel filter = new()
            {
                StartDate = startDate,
                EndDate = endDate,
            };

            return (await salesOrderRepository.GetSalesOrderDTOsAsync(queryParameters, filter)).ToList();
        }

        private async Task<double> GetInvest(IEnumerable<SalesOrderDTO> salesOrderDTOs)
        {
            var todayPurchase = salesOrderDTOs.Sum(doc => doc.Items.Sum(item => item.PurchasePrice));            

            return todayPurchase;
        }

        private double CalculatePercent(double todayValue, double yesterdayValue)
        {
            if (yesterdayValue != 0)
            {
                return ((todayValue - yesterdayValue) / yesterdayValue) * 100.0;
            }
            return 0;
        }
    }
}
