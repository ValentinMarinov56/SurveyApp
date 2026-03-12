using MongoDB.Bson;
using MongoDB.Driver;
using SurveyAPI.Models;

namespace SurveyAPI.Services;

public interface ILoginService
{
    Task<User?> AuthenticateAsync(string username, string password);
}

public class LoginService : ILoginService
{
    private readonly IMongoCollection<User> _userCollection;
    private readonly IPasswordHasher _passwordHasher;
    public LoginService(IMongoClient mongoClient, MongoDBSettings settings, IPasswordHasher passwordHasher)
    {
        var mongoDatabase = mongoClient.GetDatabase(settings.DatabaseName);
        _userCollection = mongoDatabase.GetCollection<User>(settings.UsersCollectionName);
        _passwordHasher = passwordHasher;
    }
    public async Task<User?> AuthenticateAsync(string username, string password)
    {
        User loginUser = _userCollection.Find(u => u.Username == username).FirstOrDefault();

        if (loginUser == null)
        {
            return null;
        }

        bool isVerfied = _passwordHasher.VerifyPassword(password,loginUser.PasswordHash);

        return isVerfied ? loginUser : null;
    }
}