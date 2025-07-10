using System.ComponentModel.DataAnnotations;

namespace DevDiary.DTO.Request;

public class CategoryRequest
{
    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
}
