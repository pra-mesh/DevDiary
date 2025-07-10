using DevDiary.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevDiary.Data.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _context;

    public CategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DiaryCategory>> GetAllCategoryAsync()
        => await _context.DiaryCategories.ToListAsync<DiaryCategory>();
    public async Task<DiaryCategory> AddCategory(DiaryCategory category)
    {
        await _context.DiaryCategories.AddAsync(category);
        await _context.SaveChangesAsync();
        return category;
    }
    public async Task<DiaryCategory> UpdateCategory(DiaryCategory category, Guid ID)
    {
        var dbCategory = await _context.DiaryCategories.FirstAsync(x => x.Id == ID);
        if (dbCategory == null)
            throw new BadHttpRequestException("Not Found");
        dbCategory.Name = category.Name;
        dbCategory.Description = category.Description;
        dbCategory.Color = category.Color;
        await _context.SaveChangesAsync();
        return dbCategory;
    }
    public async Task<bool> DeleteCategory(Guid ID)
    {
        var dbCategory = await _context.DiaryCategories.FirstAsync(x => x.Id == ID);
        if (dbCategory == null)
            throw new BadHttpRequestException("Not Found");
        _context.DiaryCategories.Remove(dbCategory);
        await _context.SaveChangesAsync();
        return true;

    }

    public async Task<DiaryCategory> GetCategoryDetail(Guid ID)
    {
        var result = await _context.DiaryCategories.FirstOrDefaultAsync(x => x.Id == ID);
        if (result == null)
            throw new BadHttpRequestException("Not found");
        return result;
    }
}
