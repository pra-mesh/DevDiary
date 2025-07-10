using DevDiary.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevDiary.Data;

public static class DataSeeding
{

    public static async Task Initialize(ApplicationDbContext context)
    {
        var diaryCategory = context?.DiaryCategories?.FirstOrDefault();
        if (diaryCategory is null)
        {

            List<string> Categories = ["C# Foundation",
             "Entity Framework",
             "JavaScript","React Foundation","SQL Foundation", "React Hook", "Desgin Patterns"];
            List<DiaryCategory> diaryCategories = [];
            foreach (var category in Categories)
            {
                diaryCategories.Add(new DiaryCategory { Name = category });
            }
            Console.WriteLine(String.Join(',', diaryCategories.Select(x => x.Id)));
            await context.Database.ExecuteSqlRawAsync("delete from diaryCategories");
            await context.DiaryCategories.AddRangeAsync(diaryCategories);
            await context.SaveChangesAsync();
        }
    }
}
