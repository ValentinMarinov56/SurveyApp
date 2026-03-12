namespace SurveyAPI.Models;

public class Option
{
    public required string Text { get; set; }
    public int timesAnswered {get; set;} = 0;
}