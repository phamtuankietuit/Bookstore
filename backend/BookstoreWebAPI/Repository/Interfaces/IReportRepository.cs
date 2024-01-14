using BookstoreWebAPI.Models.BindingModels.FilterModels;

namespace BookstoreWebAPI.Repository.Interfaces
{
    public interface IReportRepository
    {
        Task<dynamic> GetTodayOrderReport();
        Task<dynamic> GetOrderReport(ReportFilterModel filter, string groupBy); 
        Task<dynamic> GetOrderCountReport(ReportFilterModel filter, string groupBy);
        Task<dynamic> GetTopSoldProducts(int month, int year);
    }
}
