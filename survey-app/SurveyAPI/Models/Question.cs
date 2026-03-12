namespace SurveyAPI.Models;

public class Question
{
    public required string Text { get; set; }
    public List<Option> Options { get; set; } = new();
}
