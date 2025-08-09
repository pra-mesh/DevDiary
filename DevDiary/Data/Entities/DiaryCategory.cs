using System.Text.Json.Serialization;

namespace DevDiary.Data.Entities;

public class DiaryCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;

    public ICollection<DiaryEntry> DiaryEntries { get; set; } = [];
    public Guid? UserId { get; set; }
    [JsonIgnore]
    public Users? User { get; set; }

}
