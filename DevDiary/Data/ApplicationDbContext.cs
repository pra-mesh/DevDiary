using DevDiary.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DevDiary.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> opt) : base(opt)
    {

    }
    public DbSet<DiaryEntry> DiaryEntries { get; set; }
    public DbSet<DiaryCategory> DiaryCategories { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DiaryEntry>(e =>
        {
            e.HasKey(e => e.Id);
            e.Property(p => p.Id)
            .HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(e => e.Title).IsRequired().HasMaxLength(200);
            e.Property(e => e.Tags).HasMaxLength(1000)
             .HasConversion(v =>
             string.Join(',', v), v =>
             v.Split(',', StringSplitOptions.TrimEntries
                        | StringSplitOptions.RemoveEmptyEntries).ToList())
             .Metadata.SetValueComparer(
         new ValueComparer<ICollection<string>>(
             (c1, c2) => c1.OrderBy(s => s).SequenceEqual(c2.OrderBy(s => s)), // Comparison logic
             c => c.OrderBy(s => s).Aggregate(0, (hash, s) => HashCode.Combine(hash, s.GetHashCode())), // Hashing logic
             c => c.ToList() // Snapshotting logic
             ));
            e.HasIndex(e => e.Title);
        });

        modelBuilder.Entity<DiaryCategory>(e =>
        {
            e.HasKey(e => e.Id);
            e.Property(p => p.Id)
             .HasDefaultValueSql("NEWID()"); //"NEWID()" for random guid
            e.Property(p => p.Name).IsRequired()
             .HasMaxLength(100);
            e.Property(p => p.Color).HasMaxLength(100);
            e.HasIndex(e => e.Name).IsUnique();
            e.HasMany(c => c.DiaryEntries)
             .WithOne(d => d.Category)
             .HasForeignKey(c => c.CategoryID)
             .IsRequired()
             .OnDelete(DeleteBehavior.Restrict);
        });

    }

}
