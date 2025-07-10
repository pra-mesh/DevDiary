namespace DevDiary.DTO.Request;

public class DiaryEntryRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid CategoryID { get; set; }
    public List<string> Tags { get; set; } = new();
}
