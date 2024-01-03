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

    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<AppUser>(build =>
        {
            build.Property(x => x.DateOfBirth)
                .HasConversion<DateOnlyConverter, DateOnlyComparer>();
        });
        builder.Entity<UserLike>()
               .HasKey(k => new { k.SourceUserId, k.TargetUserId });

        builder.Entity<UserLike>()
               .HasOne(s => s.SourceUser)
               .WithMany(l => l.LikedUsers)
               .HasForeignKey(s => s.SourceUserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>()
        .HasOne(s => s.TargetUser)
        .WithMany(l => l.LikedByUsers)
        .HasForeignKey(s => s.TargetUserId)
        .OnDelete(DeleteBehavior.NoAction);
        //.OnDelete(DeleteBehavior.Cascade);// For SQL Lite

        builder.Entity<Message>()
          .HasOne(u => u.Recipient)
          .WithMany(m => m.MessagesReceived)
          .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(u => u.Sender)
            .WithMany(m => m.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }

}
