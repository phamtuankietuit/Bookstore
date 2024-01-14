using BookstoreWebAPI.Models.BindingModels;
using BookstoreWebAPI.Models.BindingModels.FilterModels;
using BookstoreWebAPI.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookstoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController(
        ILogger<ReportsController> logger,
        ISalesOrderRepository salesOrderRepository,
        IReturnOrderRepository returnOrderRepository,
        IPurchaseOrderRepository purchaseOrderRepository
    ) : ControllerBase
    {
        [HttpGet("today")]
        public async Task<ActionResult> GetNumberOfOrderToday()
        {
            QueryParameters queryParameters = new QueryParameters()
            {
                PageNumber = 1,
                PageSize = 1
            };

            SalesOrderFilterModel filter = new()
            {
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
            };

            ReturnOrderFilterModel filterReturn = new()
            {
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
            };
            PurchaseOrderFilterModel filterPurchase = new()
            {
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
            };

            var todayOrders = await salesOrderRepository.GetSalesOrderDTOsAsync(queryParameters, filter);
            var todayReturn = await returnOrderRepository.GetReturnOrderDTOsAsync(queryParameters, filterReturn);
            var todayPurchase = await purchaseOrderRepository.GetPurchaseOrderDTOsAsync(queryParameters, filterPurchase);
            var todayOrdersCount = salesOrderRepository.TotalCount;

            filter.StartDate = DateTime.Now.AddDays(-1);
            filter.EndDate = DateTime.Now.AddDays(-1);

            var yesterdayOrders = await salesOrderRepository.GetSalesOrderDTOsAsync(queryParameters, filter);
            var yesterdayOrdersCount = salesOrderRepository.TotalCount;

            var growthPercentage = ((double)todayOrdersCount - yesterdayOrdersCount) / (double)yesterdayOrdersCount * 100.0;


            var todayRevenue = todayOrders.Sum(order => order.TotalAmount);
            var todayInvest = todayReturn.Sum(order => order.TotalAmount) + todayPurchase.Sum(order => order.TotalAmount);

            var todayProfit = todayRevenue - todayInvest;

            return Ok(new
            {
                count = todayOrdersCount,
                growthPercentage = string.Format("{0:0.00}", growthPercentage),
                revenue = todayRevenue,
                profit = todayProfit
            });
        }
    }
}
