using CosmosChangeFeedFunction.Models.Documents;


namespace CosmosChangeFeedFunction.Repositories.Interfaces
{
    public interface ISupplierRepository
    {
        Task<Supplier?> GetSupplierByIdAsync(string supplierId);
        Task<IEnumerable<Supplier>?> UpdateSupplierGroup(SupplierGroup supplierGroup);
        Task<IEnumerable<Supplier>?> ResetSupplierGroup(SupplierGroup supplierGroup);
        Task DeleteSupplierAsync(Supplier supplier);
    }
}
