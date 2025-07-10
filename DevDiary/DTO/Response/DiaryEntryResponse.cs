namespace DevDiary.DTO.Response;

public class DiaryEntryResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid CategoryID { get; set; }
    public List<string> Tags { get; set; } = new();
    public string CategoryName { get; set; } = string.Empty;
    public string? CategoryColor { get; set; }
    public string? CategoryDescription { get; set; }
}
