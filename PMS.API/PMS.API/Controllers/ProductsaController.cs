using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PMS.API.Data;
using PMS.API.Interfaces;
using PMS.API.Models;

namespace PMS.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly PMSDbContext _pmsDbcontext;
        private readonly IProductService _productService;
        public ProductsController(PMSDbContext pmsDbContext, IProductService productService)
        {
            this._pmsDbcontext = pmsDbContext;
            _productService = productService ?? throw new ArgumentNullException(nameof(productService)); ;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(int pageNumber, int pageSize, string sortBy = null, string sortDirection = "asc", string name = null)
        {
            if (name != null) {
                var query = _pmsDbcontext.products.Where(x => x.Name.ToLower() == name.ToLower());

                var totalSeachedItems = await query.CountAsync();
                var totalSearchedPages = (int)Math.Ceiling((double)totalSeachedItems / pageSize);

                var searchedProducts = await query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var searchedResponse = new
                {
                    Data = searchedProducts,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalItems = totalSeachedItems,
                    TotalPages = totalSearchedPages
                };

                if (searchedProducts == null || searchedProducts.Count == 0)
                {
                    return NotFound();
                }
                return Ok(searchedResponse);
            }
            var products = await _productService.GetProductsAsync(pageNumber, pageSize, sortBy, sortDirection, name);
            var totalItems = await _productService.GetTotalProductsCountAsync();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            var response = new
            {
                Data = products,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        [HttpGet("search")]
        public IActionResult Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query cannot be empty or whitespace.");
            }

            var suggestions = _productService.GetSuggestions(query);
            return Ok(suggestions);
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        { 
            product.Id = Guid.NewGuid();

            await _pmsDbcontext.AddAsync(product);
            await _pmsDbcontext.SaveChangesAsync();

            return Ok(product);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetItem(Guid id)
        {
            var product = await _pmsDbcontext.products.FirstOrDefaultAsync(x => x.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] Product productToUpdate)
        {
            if (productToUpdate == null)
            {
                return BadRequest("Product data is null");
            }

            var product = await _pmsDbcontext.products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Update the product's properties
            product.Name = productToUpdate.Name;
            product.Type = productToUpdate.Type;
            product.Color = productToUpdate.Color;
            product.Price = productToUpdate.Price;

            // Save changes to the database
            try
            {
                await _pmsDbcontext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(productToUpdate);
        }

        private bool ProductExists(Guid id)
        {
            return _pmsDbcontext.products.Any(e => e.Id == id);
        }


        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _pmsDbcontext.products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _pmsDbcontext.products.Remove(product);
            await _pmsDbcontext.SaveChangesAsync();

            return Ok(product);
        }
    }

}

