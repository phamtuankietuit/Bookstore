namespace ChangeFeedCatchFunction.Repositories
{
    public interface IProductRepository
    {
        Task ResetProductsCategoryBelongToCategoryIdAsync(string categoryId);
        Task UpdateProductCategoryBelongToCategoryIdAsync(string categoryId);
    }
}
