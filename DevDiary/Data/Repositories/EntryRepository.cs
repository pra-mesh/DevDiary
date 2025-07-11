using DevDiary.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevDiary.Data.Repositories;

public class EntryRepository : IEntryRepository
{
    private readonly ApplicationDbContext _context;

    public EntryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DiaryEntry> Insert(DiaryEntry entry)
    {
        await _context.DiaryEntries.AddAsync(entry);
        await _context.SaveChangesAsync();
        return await _context.DiaryEntries.Include(d => d.Category).FirstAsync(x => x.Id == entry.Id);
    }

    public async Task<List<DiaryEntry>> GetEntries(
        int page = 1, int pageSize = 10, string? CategoryID = null, string? search = null)
    {
        var query = _context.DiaryEntries
      .AsNoTracking();

        if (!string.IsNullOrEmpty(CategoryID) && Guid.TryParse(CategoryID, out Guid validGuid))
        {
            query = query.Where(e => e.CategoryID == validGuid);
        }

        if (!string.IsNullOrEmpty(search))
        {
            //TODO: instead of or we can make and or exact search 
            search = search.Trim().Replace(" ", " or ");
            query = query.Where(e =>
                EF.Functions.Contains(e.Content, search) ||
                EF.Functions.Contains(e.Title, search) ||
                EF.Functions.Contains(e.Tags, search));
        }

        var pagedResults = await query
            .OrderByDescending(e => e.CreatedAt)
            .ThenBy(e => e.Id)
            .Include(d => d.Category)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return pagedResults;
    }
    public async Task<DiaryEntry> Update(DiaryEntry diaryEntry, Guid id)
    {
        var dbEntry = await _context.DiaryEntries.FirstOrDefaultAsync(x => x.Id == id);
        if (dbEntry == null)
            throw new Exception("Entry not found");
        dbEntry.Title = diaryEntry.Title;
        dbEntry.Tags = diaryEntry.Tags;
        dbEntry.UpdatedAt = diaryEntry.UpdatedAt;
        dbEntry.CategoryID = diaryEntry.CategoryID;
        dbEntry.Content = diaryEntry.Content;
        await _context.SaveChangesAsync();

        return await _context.DiaryEntries
                        .Include(x => x.Category)
                        .FirstAsync(x => x.Id == id); ;
    }
    public async Task<bool> Remove(Guid id)
    {
        var dbEntry = await _context.DiaryEntries.FirstOrDefaultAsync(x => x.Id == id);
        if (dbEntry == null)
            throw new Exception("Entry not found");
        _context.DiaryEntries.Remove(dbEntry);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DiaryEntry> GetByID(Guid id)
    {
        var dbEntry = await _context.DiaryEntries
                                    .Include(x => x.Category)
                                    .FirstOrDefaultAsync(x => x.Id == id);
        if (dbEntry == null)
            throw new Exception("Entry not found");
        return dbEntry;

    }
}
