namespace DevDiary.Data.Entities;

public class Users
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public ICollection<DiaryCategory> DiaryCategories { get; set; } = [];
    public ICollection<DiaryEntry> DiaryEntries { get; set; } = [];
}