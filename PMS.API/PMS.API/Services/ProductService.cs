using Microsoft.EntityFrameworkCore;
using PMS.API.Data;
using PMS.API.Interfaces;
using PMS.API.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace PMS.API.Services
{
    public class ProductService : IProductService
    {
        private readonly PMSDbContext _pmsDbcontext;
        private readonly PMSDbContext _context;

        public ProductService(PMSDbContext pmsDbContext, PMSDbContext context)
        {
            this._pmsDbcontext = pmsDbContext;
            _context = context;
        }

        public async Task<List<Product>> GetProductsAsync(int pageNumber, int pageSize, string sortBy = null, string sortDirection = "asc", string name = null)
        {
            var productsQuery = _context.products.AsQueryable();

            ApplySorting(ref productsQuery, sortBy, sortDirection);

            var products = await productsQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return products;
        }

        public async Task<(List<Product> Products, int TotalCount)> GetSearchedProductsAsync(int pageNumber, int pageSize, string sortBy = null, string sortDirection = "asc", string name = null)
        {
            var productsQuery = _pmsDbcontext.products.Where(x => x.Name.ToLower() == name.ToLower());

            int totalSearchedItems = await productsQuery.CountAsync();

            ApplySorting(ref productsQuery, sortBy, sortDirection);

            var products = await productsQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (products, totalSearchedItems);
        }

        private void ApplySorting(ref IQueryable<Product> productsQuery, string sortBy, string sortDirection)
        {
            if (!string.IsNullOrEmpty(sortBy))
            {
                bool descending = sortDirection.ToLower() == "desc";
                productsQuery = sortBy.ToLower() switch
                {
                    "name" => descending ? productsQuery.OrderByDescending(p => p.Name) : productsQuery.OrderBy(p => p.Name),
                    "type" => descending ? productsQuery.OrderByDescending(p => p.Type) : productsQuery.OrderBy(p => p.Type),
                    "color" => descending ? productsQuery.OrderByDescending(p => p.Color) : productsQuery.OrderBy(p => p.Color),
                    "price" => descending ? productsQuery.OrderByDescending(p => p.Price) : productsQuery.OrderBy(p => p.Price),
                    _ => productsQuery
                };
            }
        }

        public async Task<int> GetTotalProductsCountAsync()
        {
            return await _context.products.CountAsync();
        }

        public IEnumerable<string> GetSuggestions(string query)
        {
            return _context.products
                .Where(p => p.Name.Contains(query))
                .Select(p => p.Name)
                .Take(10)
                .ToList();
        }
    }
}
