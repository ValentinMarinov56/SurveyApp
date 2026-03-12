namespace SurveyAPI.Models;

public class SurveyWithCreatorDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public List<Question> Questions { get; set; } = new();
    public required UserDto Creator { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public required string Username { get; set; }
}
