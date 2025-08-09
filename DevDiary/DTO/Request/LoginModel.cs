using System.ComponentModel.DataAnnotations;

namespace DevDiary.DTO.Request;

public class LoginModel : SignUpModel
{

    [Required]
    [Length(6, 6)]
    public required string Password { get; set; }
}
public class SignUpModel
{
    [Required]
    public required string UserName { get; set; }
}
