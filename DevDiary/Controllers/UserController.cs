using DevDiary.Data.Repositories;
using DevDiary.DTO.Request;
using Microsoft.AspNetCore.Mvc;

namespace DevDiary.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepositories _user;

    public UserController(IUserRepositories user)
    {
        _user = user;
    }
    [HttpPost("login")]
    public async Task<IActionResult> login(LoginModel login)
    {
        var output = await _user.User(login.UserName, login.Password);
        return Ok(new { output.Id });
    }
    [HttpPost("signUp")]
    public async Task<IActionResult> SignUp(SignUpModel signUp) => Ok(await _user.Add(signUp.UserName));
}
