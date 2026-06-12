using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    [HttpGet]
    public async Task<IActionResult> GetSurveys()
    {
        var surveys = await _surveyService.GetSurveysAsync();
        return Ok(surveys);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSurvey(int id)
    {
        var survey = await _surveyService.GetSurveyAsync(id);
        if (survey == null)
        {
            return NotFound();
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

        survey.CreatorId = userId;
        var createdSurvey = await _surveyService.CreateSurveyAsync(survey);
        return CreatedAtAction(nameof(GetSurvey), new { id = createdSurvey.Id }, createdSurvey);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSurvey(int id, [FromBody] Survey survey)
    {
        var updated = await _surveyService.UpdateSurveyAsync(id, survey);
        if (!updated)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteSurvey(int id)
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid");
        if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
            return Unauthorized("Invalid token: User ID claim not found or invalid.");

        var deleted = await _surveyService.DeleteSurveyAsync(id, userId);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
