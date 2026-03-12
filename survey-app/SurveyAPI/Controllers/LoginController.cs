using Microsoft.AspNetCore.Mvc;
using SurveyAPI.Models;
using SurveyAPI.Services;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly ILoginService _loginService;
    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }
    public class LoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    public class LoginResponse
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Token { get; set; } = null!;
    }
    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate([FromBody] LoginRequest request)
    {
        var user = await _loginService.AuthenticateAsync(request.Username, request.Password);
        if (user == null)
        {
            return Unauthorized();
        }

        var jwtService = new JwtService(Environment.GetEnvironmentVariable("SECRET")!, 60);
        var token = jwtService.GenerateToken(user.Id, user.Username);

        return Ok(new LoginResponse
        {
            UserId = user.Id,
            Username = user.Username,
            Token = token
        });
    }
}