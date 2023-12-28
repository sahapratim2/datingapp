using API.Entities;
using API.Extensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{

    public DataContext(DbContextOptions options) : base(options)
    {
        // Your configuration code here
    }
    //require to convert Date
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(builder =>
        {
            builder.Property(x => x.DateOfBirth)
                .HasConversion<DateOnlyConverter, DateOnlyComparer>();
        });
    }
    public DbSet<AppUser> Users { get; set; }

}
