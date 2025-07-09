namespace DevDiary.Data.Entities;

public class DiaryCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;

    public ICollection<DiaryEntry> DiaryEntries { get; set; } = [];
}
