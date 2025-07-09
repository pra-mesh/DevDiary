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
}
