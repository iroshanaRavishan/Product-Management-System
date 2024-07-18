using PMS.API.Models;

namespace PMS.API.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProductsAsync(int pageNumber, int pageSize);
        Task<int> GetTotalProductsCountAsync();
    }
}
