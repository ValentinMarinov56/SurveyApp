namespace SurveyAPI.Models;

public class UserWithSurveysDto
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public List<SurveyBasicDto> Surveys { get; set; } = new();
}

public class SurveyBasicDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
}
