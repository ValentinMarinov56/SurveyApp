namespace SurveyAPI.Models;

public class Survey
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<Question> Questions { get; set; } = new();
    public int CreatorId { get; set; }
    public string ViewPermission { get; set; } = "All";
    public string TakePermission { get; set; } = "All";
}
