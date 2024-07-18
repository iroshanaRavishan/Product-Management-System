using Microsoft.EntityFrameworkCore;
using PMS.API.Data;
using PMS.API.Interfaces;
using PMS.API.Models;

namespace PMS.API.Services
{
    public class ProductService : IProductService
    {
        private readonly PMSDbContext _context;

        public ProductService(PMSDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetProductsAsync(int pageNumber, int pageSize)
        {
            return await _context.products
                                 .Skip((pageNumber - 1) * pageSize)
                                 .Take(pageSize)
                                 .ToListAsync();
        }

        public async Task<int> GetTotalProductsCountAsync()
        {
            return await _context.products.CountAsync();
        }
    }

}
