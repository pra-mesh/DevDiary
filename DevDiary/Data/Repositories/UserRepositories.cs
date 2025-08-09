using DevDiary.Data.Entities;
using System.Security.Cryptography;

namespace DevDiary.Data.Repositories;

public class UserRepositories : IUserRepositories
{
    private readonly ApplicationDbContext _dbContext;

    public UserRepositories(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Users> User(string userName, string key)
    {
        var user = _dbContext.Users.FirstOrDefault(x => x.UserName == userName);
        if (user == null)
        {
            throw new UnauthorizedAccessException();
        }
        if (user.Key != key)
            throw new UnauthorizedAccessException();
        return user;
    }

    public async Task<Users> Add(string userName)
    {
        var user = _dbContext.Users.FirstOrDefault(x => x.UserName == userName);
        if (user != null)
        {
            throw new Exception("User name already used");
        }
        string otp = RandomNumberGenerator.GetInt32(1, 1000000).ToString("D6");
        Users newUser = new Users { UserName = userName, Key = otp };
        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();
        return newUser;
    }
}
