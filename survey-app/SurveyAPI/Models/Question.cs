namespace SurveyAPI.Models;

public class Question
{
    public string Text { get; set; } = string.Empty;
    public List<Option> Options { get; set; } = new();
    public string QuestionType { get; set; } = "Single";
    public int? MinSelections { get; set; }
    public int? MaxSelections { get; set; }
}
