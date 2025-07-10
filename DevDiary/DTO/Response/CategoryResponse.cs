using DevDiary.DTO.Request;

namespace DevDiary.DTO.Response;

public class CategoryResponse : CategoryRequest
{
    public Guid Id { get; set; }
}
