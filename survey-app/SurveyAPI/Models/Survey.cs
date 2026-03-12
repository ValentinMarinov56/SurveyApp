namespace SurveyAPI.Models;

public class Survey
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public List<Question> Questions { get; set; } = new();
    public int CreatorId { get; set; }
}
