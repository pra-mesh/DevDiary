using DevDiary.Data.Entities;

namespace DevDiary.Data.Repositories;
public interface IUserRepositories
{
    Task<Users> Add(string userName);
    Task<Users> User(string username, string Key);
}