using System.ComponentModel.DataAnnotations;

namespace DevDiary.DTO.Request;

public class DiaryEntryRequest
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

    [Required]
    public Guid CategoryID { get; set; }
    public List<string>? Tags { get; set; } = new();
}
