using Microsoft.AspNetCore.Mvc;
using SurveyAPI.Models;
using SurveyAPI.Services;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetUsersAsync();
        return Ok(users);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _userService.GetUserAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody]User user)
    {
        var createdUser = await _userService.CreateUserAsync(user);

        var jwtService = new JwtService(Environment.GetEnvironmentVariable("SECRET")!, 60); 
        var token = jwtService.GenerateToken(createdUser.Id, createdUser.Username);

        return CreatedAtAction(nameof(GetUser), new {id = createdUser.Id, Token = token},createdUser);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userService.DeleteUserAsync(id);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}