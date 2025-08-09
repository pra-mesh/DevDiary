using DevDiary.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

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
            await context!.Database.ExecuteSqlRawAsync("delete from diaryCategories");
            await context.DiaryCategories.AddRangeAsync(diaryCategories);
            await context.SaveChangesAsync();
        }
        if (!context?.Users.Any() ?? false)
        {
            string otp = RandomNumberGenerator.GetInt32(1, 1000000).ToString("D6");
            Users user = new Users { UserName = "Pramesh", Key = otp };
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            var entries = await context.DiaryEntries.ToListAsync();
            entries.ForEach(p => p.UserId = user.Id);
            await context.SaveChangesAsync();

        }
    }
}
