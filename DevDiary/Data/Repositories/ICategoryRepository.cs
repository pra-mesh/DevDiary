using DevDiary.Data.Entities;

namespace DevDiary.Data.Repositories;
public interface ICategoryRepository
{
    Task<DiaryCategory> AddCategory(DiaryCategory category);
    Task<bool> DeleteCategory(Guid ID);
    Task<IEnumerable<DiaryCategory>> GetAllCategoryAsync();
    Task<DiaryCategory> GetCategoryDetail(Guid ID);
    Task<DiaryCategory> UpdateCategory(DiaryCategory category, Guid ID);
}