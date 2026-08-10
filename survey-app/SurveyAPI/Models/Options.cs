namespace SurveyAPI.Models;

public class Option
{
    public string Text { get; set; } = string.Empty;
    public int timesAnswered {get; set;} = 0;
}