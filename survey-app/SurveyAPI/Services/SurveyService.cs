using MongoDB.Bson;
using MongoDB.Driver;
using SurveyAPI.Models;

namespace SurveyAPI.Services;

public interface ISurveyService
{
    Task<List<SurveyWithCreatorDto>> GetSurveysAsync();
    Task<SurveyWithCreatorDto?> GetSurveyAsync(int id);
    Task<Survey> CreateSurveyAsync(Survey survey);
    Task<bool> UpdateSurveyAsync(int id, Survey survey);
    Task<bool> DeleteSurveyAsync(int id);
}

public class SurveyService : ISurveyService
{
    private readonly IMongoCollection<Survey> _surveysCollection;
    private readonly IMongoCollection<User> _usersCollection;

    public SurveyService(IMongoClient mongoClient, MongoDBSettings settings)
    {
        var mongoDatabase = mongoClient.GetDatabase(settings.DatabaseName);
        _surveysCollection = mongoDatabase.GetCollection<Survey>(settings.SurveysCollectionName);
        _usersCollection = mongoDatabase.GetCollection<User>(settings.UsersCollectionName);
    }

    public async Task<List<SurveyWithCreatorDto>> GetSurveysAsync()
    {
        var surveys = await _surveysCollection.Find(_ => true).ToListAsync();
        var dtos = new List<SurveyWithCreatorDto>();

        foreach (var survey in surveys)
        {
            var user = await _usersCollection.Find(u => u.Id == survey.CreatorId).FirstOrDefaultAsync();
            dtos.Add(new SurveyWithCreatorDto
            {
                Id = survey.Id,
                Title = survey.Title,
                Questions = survey.Questions,
                Creator = user != null ? new UserDto { Id = user.Id, Username = user.Username } : new UserDto { Id = 0, Username = "Unknown" }
            });
        }

        return dtos;
    }

    public async Task<SurveyWithCreatorDto?> GetSurveyAsync(int id)
    {
        var survey = await _surveysCollection.Find(s => s.Id == id).FirstOrDefaultAsync();
        if (survey == null)
            return null;

        var user = await _usersCollection.Find(u => u.Id == survey.CreatorId).FirstOrDefaultAsync();
        return new SurveyWithCreatorDto
        {
            Id = survey.Id,
            Title = survey.Title,
            Questions = survey.Questions,
            Creator = user != null ? new UserDto { Id = user.Id, Username = user.Username } : new UserDto { Id = 0, Username = "Unknown" }
        };
    }

    public async Task<Survey> CreateSurveyAsync(Survey survey)
    {
        var existingSurveys = await _surveysCollection.Find(_ => true).ToListAsync();
        survey.Id = existingSurveys.Count > 0 ? existingSurveys.Max(s => s.Id) + 1 : 1;
        
        var user = await _usersCollection.Find(u => u.Id == survey.CreatorId).FirstOrDefaultAsync();
        if (user != null)
        {
            user.Surveys.Add(survey.Id);
            await _usersCollection.ReplaceOneAsync(u => u.Id == user.Id, user);
        }

        await _surveysCollection.InsertOneAsync(survey);
        return survey;
    }

    public async Task<bool> UpdateSurveyAsync(int id, Survey survey)
    {
        survey.Id = id;
        var result = await _surveysCollection.ReplaceOneAsync(s => s.Id == id, survey);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteSurveyAsync(int id)
    {
        var result = await _surveysCollection.DeleteOneAsync(s => s.Id == id);
        return result.DeletedCount > 0;
    }
}
