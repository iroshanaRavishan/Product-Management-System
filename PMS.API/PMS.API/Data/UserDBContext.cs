using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PMS.API.Models;

namespace PMS.API.Data
{
    public class UserDBContext : IdentityDbContext
    {
        public UserDBContext(DbContextOptions<UserDBContext> options): base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuring LoginModel as a keyless entity
            modelBuilder.Entity<LoginModel>().HasNoKey();

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<LoginModel> Users { get; set; }
    }
}
