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
}
