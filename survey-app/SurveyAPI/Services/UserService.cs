using MongoDB.Bson;
using MongoDB.Driver;
using SurveyAPI.Models;

namespace SurveyAPI.Services;

public interface IUserService
{
    Task<List<UserWithSurveysDto>> GetUsersAsync();
    Task<UserWithSurveysDto?> GetUserAsync(int id);
    Task<User> CreateUserAsync(User user);
    Task<bool> DeleteUserAsync(int id);
}

public class UserService : IUserService
{
    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoCollection<Survey> _surveyCollection;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IMongoClient mongoClient, MongoDBSettings settings, IPasswordHasher passwordHasher)
    {
        var mongoDatabase = mongoClient.GetDatabase(settings.DatabaseName);
        _userCollection = mongoDatabase.GetCollection<User>(settings.UsersCollectionName);
        _surveyCollection = mongoDatabase.GetCollection<Survey>(settings.SurveysCollectionName);
        _passwordHasher = passwordHasher;
    }
    public async Task<List<UserWithSurveysDto>> GetUsersAsync()
    {
        var users = await _userCollection.Find(_ => true).ToListAsync();
        var dtos = new List<UserWithSurveysDto>();

        foreach (var user in users)
        {
            var surveys = await _surveyCollection.Find(s => s.CreatorId == user.Id).ToListAsync();
            dtos.Add(new UserWithSurveysDto
            {
                Id = user.Id,
                Username = user.Username,
                Surveys = surveys.Select(s => new SurveyBasicDto { Id = s.Id, Title = s.Title }).ToList()
            });
        }

        return dtos;
    }
    public async Task<UserWithSurveysDto?> GetUserAsync(int id)
    {
        var user = await _userCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
        if (user == null)
            return null;

        var surveys = await _surveyCollection.Find(s => s.CreatorId == user.Id).ToListAsync();
        return new UserWithSurveysDto
        {
            Id = user.Id,
            Username = user.Username,
            Surveys = surveys.Select(s => new SurveyBasicDto { Id = s.Id, Title = s.Title }).ToList()
        };
    }
    public async Task<User> CreateUserAsync(User user)
    {
        var existingUser = await _userCollection.Find(_ => true).ToListAsync();
        user.Id = existingUser.Count > 0 ? existingUser.Max(s => s.Id) + 1 : 1;
        
        user.PasswordHash = _passwordHasher.HashPassword(user.PasswordHash);

        await _userCollection.InsertOneAsync(user);
        return user;
    }
    public async Task<bool> DeleteUserAsync(int id)
    {
        var result = await _userCollection.DeleteOneAsync(u => u.Id == id);
        return result.DeletedCount > 0;
    }
}