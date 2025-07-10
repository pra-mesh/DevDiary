using DevDiary.Data.Entities;

namespace DevDiary.Data.Repositories;
public interface IEntryRepository
{
    Task<DiaryEntry> Insert(DiaryEntry entry);
}