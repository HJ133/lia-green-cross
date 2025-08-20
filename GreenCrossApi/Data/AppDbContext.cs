using Microsoft.EntityFrameworkCore;
using GreenCrossApi.Models;

namespace GreenCrossApi.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ClickEvent> ClickEvents { get; set; }
  }
}