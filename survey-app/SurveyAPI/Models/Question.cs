namespace SurveyAPI.Models;

public class Question
{
    public required string Text { get; set; }
    public List<Option> Options { get; set; } = new();
    public string QuestionType { get; set; } = "Single";
    public int? MaxSelections { get; set; }
}
