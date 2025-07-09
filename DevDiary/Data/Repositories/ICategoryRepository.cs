using DevDiary.Data.Entities;

namespace DevDiary.Data.Repositories;
public interface ICategoryRepository
{
    Task<IEnumerable<DiaryCategory>> GetAllCategoryAsync();
}