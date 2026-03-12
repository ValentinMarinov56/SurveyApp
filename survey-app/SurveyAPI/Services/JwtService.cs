using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using SurveyAPI.Models;

namespace SurveyAPI.Services;

public interface IJwtService
{
    string GenerateToken(int userId, string username); 
}
public sealed class JwtService : IJwtService
{
    private readonly string _secretKey;
    private readonly int _expiryDurationMinutes;

    public JwtService(string secretKey, int expiryDurationMinutes)
    {
        _secretKey = secretKey;
        _expiryDurationMinutes = expiryDurationMinutes;
    }

    public string GenerateToken(int userId, string username)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, username)
            }),
            Expires = DateTime.UtcNow.AddMinutes(_expiryDurationMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}