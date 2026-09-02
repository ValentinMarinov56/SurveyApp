using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using SurveyAPI.Models;
using SurveyAPI.Services;

[ApiController]
[Route("api/[controller]")]
public class SurveyController : ControllerBase
{
    private readonly ISurveyService _surveyService;

    public SurveyController(ISurveyService surveyService)
    {
        _surveyService = surveyService;
    }

    private int? GetCurrentUserId()
    {
        var idClaim = User?.FindFirst(ClaimTypes.NameIdentifier) ?? User?.FindFirst("nameid");
        if (idClaim != null && int.TryParse(idClaim.Value, out var userId))
        {
            return userId;
        }

        return null;
    }

    private bool CanViewSurvey(int creatorId, string viewPermission, int? currentUserId)
    {
        return viewPermission switch
        {
            "All" => true,
            "NeedsProfile" => currentUserId.HasValue,
            "Owner" => currentUserId.HasValue && creatorId == currentUserId.Value,
            _ => true,
        };
    }

    private bool CanTakeSurvey(string takePermission, int? currentUserId)
    {
        return takePermission switch
        {
            "All" => true,
            "NeedsProfile" => currentUserId.HasValue,
            _ => true,
        };
    }

    [HttpGet]
    public async Task<IActionResult> GetSurveys()
    {
        var currentUserId = GetCurrentUserId();
        var surveys = await _surveyService.GetSurveysAsync();
        var visibleSurveys = surveys
            .Where(s => CanViewSurvey(s.Creator?.Id ?? 0, s.ViewPermission ?? "All", currentUserId))
            .ToList();
        return Ok(visibleSurveys);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSurvey(int id)
    {
        var currentUserId = GetCurrentUserId();
        var survey = await _surveyService.GetSurveyAsync(id);
        if (survey == null)
        {
            return NotFound();
        }

        if (!CanViewSurvey(survey.Creator?.Id ?? 0, survey.ViewPermission ?? "All", currentUserId))
        {
            return Forbid();
        }

        return Ok(survey);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateSurvey([FromBody] Survey survey)
    {
        if (!(User?.Identity?.IsAuthenticated ?? false))
            return Unauthorized("User is not authenticated.");

        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid");
        if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
            return Unauthorized("Invalid token: User ID claim not found or invalid.");

        survey ??= new Survey();
        survey.Title ??= string.Empty;
        survey.Questions ??= new List<Question>();

        foreach (var question in survey.Questions)
        {
            question.Options ??= new List<Option>();
            question.Text = question.Text?.Trim() ?? string.Empty;
            question.QuestionType = string.Equals(question.QuestionType, "Multiple", StringComparison.OrdinalIgnoreCase) ? "Multiple" : "Single";
            question.MinSelections ??= 1;
            question.MaxSelections ??= 1;
        }

        if (!ValidateSurvey(survey, out var validationError))
            return BadRequest(validationError);

        survey.CreatorId = userId;
        var createdSurvey = await _surveyService.CreateSurveyAsync(survey);
        return CreatedAtAction(nameof(GetSurvey), new { id = createdSurvey.Id }, createdSurvey);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSurvey(int id, [FromBody] Survey survey)
    {
        var currentUserId = GetCurrentUserId();
        var existingSurvey = await _surveyService.GetSurveyAsync(id);
        if (existingSurvey == null)
            return NotFound();

        if (existingSurvey.TakePermission == "NeedsProfile" && !currentUserId.HasValue)
            return Forbid();

        survey ??= new Survey();
        survey.Title ??= string.Empty;
        survey.Questions ??= new List<Question>();
        survey.ViewPermission ??= "All";
        survey.TakePermission ??= "All";

        foreach (var question in survey.Questions)
        {
            question.Options ??= new List<Option>();
            question.Text = question.Text?.Trim() ?? string.Empty;
            question.QuestionType = string.Equals(question.QuestionType, "Multiple", StringComparison.OrdinalIgnoreCase) ? "Multiple" : "Single";
            question.MinSelections ??= 1;
            question.MaxSelections ??= 1;
        }

        if (!ValidateSurvey(survey, out var validationError))
            return BadRequest(validationError);

        var updated = await _surveyService.UpdateSurveyAsync(id, survey);
        if (!updated)
            return NotFound();
        return NoContent();
    }

    private bool ValidateSurvey(Survey survey, out string error)
    {
        if (string.IsNullOrWhiteSpace(survey.Title) || survey.Title.Length > 100)
        {
            error = "Survey title cannot be empty and must be at most 100 characters.";
            return false;
        }

        if (survey.Questions == null || survey.Questions.Count == 0 || survey.Questions.Count > 20)
        {
            error = "Survey must have at least 1 question and at most 20 questions.";
            return false;
        }

        for (var i = 0; i < survey.Questions.Count; i++)
        {
            var question = survey.Questions[i];
            if (string.IsNullOrWhiteSpace(question.Text) || question.Text.Length > 200)
            {
                error = $"Question #{i + 1} text cannot be empty and must be at most 200 characters.";
                return false;
            }

            if (question.Options == null || question.Options.Count == 0 || question.Options.Count > 10)
            {
                error = $"Question #{i + 1} must have at least one option and at most 10 options.";
                return false;
            }

            foreach (var option in question.Options)
            {
                option.Text = option.Text?.Trim() ?? string.Empty;
                if (string.IsNullOrWhiteSpace(option.Text) || option.Text.Length > 100)
                {
                    error = $"Question #{i + 1} has an invalid option; option text cannot be empty and must be at most 100 characters.";
                    return false;
                }
            }

            if (question.QuestionType == "Multiple")
            {
                var minSelections = question.MinSelections ?? 1;
                var maxSelections = question.MaxSelections ?? 1;

                if (minSelections < 1 || maxSelections < 1 || minSelections > maxSelections || maxSelections > question.Options.Count)
                {
                    error = $"Question #{i + 1} has invalid selection limits. Min selections must be at least 1, max selections must be at least min selections, and max selections cannot exceed the number of options.";
                    return false;
                }
            }
            else
            {
                question.MinSelections = 1;
                question.MaxSelections = 1;
            }
        }

        error = string.Empty;
        return true;
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteSurvey(int id)
    {
        if (!(User?.Identity?.IsAuthenticated ?? false))
            return Unauthorized("User is not authenticated.");

        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid");
        if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
            return Unauthorized("Invalid token: User ID claim not found or invalid.");

        var deleted = await _surveyService.DeleteSurveyAsync(id, userId);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
