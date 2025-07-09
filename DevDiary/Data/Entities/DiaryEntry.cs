namespace DevDiary.Data.Entities;

public class DiaryEntry
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; }
    public Guid CategoryID { get; set; }
    public DiaryCategory Category { get; set; } = null!;
    public List<string> Tags { get; set; } = new();

}
