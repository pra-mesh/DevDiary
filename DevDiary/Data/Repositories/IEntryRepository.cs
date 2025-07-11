using DevDiary.Data.Entities;

namespace DevDiary.Data.Repositories;
public interface IEntryRepository
{
    Task<DiaryEntry> GetByID(Guid id);
    Task<List<DiaryEntry>> GetEntries(int page = 1, int pageSize = 10, string? CategoryID = null, string? search = null);
    Task<DiaryEntry> Insert(DiaryEntry entry);
    Task<bool> Remove(Guid id);
    Task<DiaryEntry> Update(DiaryEntry diaryEntry, Guid id);
}