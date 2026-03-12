using dotenv.net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Mongo2Go;
using SurveyAPI.Models;
using SurveyAPI.Services;
using System.Text;

// Load .env file
dotenv.net.DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",
        policy =>
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod());
});

// Configure MongoDB settings from environment variables or defaults
// if no connection string is set and localhost isn't reachable, launch an
// embedded MongoDB instance (Mongo2Go). This allows running the API
// locally without installing MongoDB or passing in a URI.
string connectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING");
Mongo2Go.MongoDbRunner? mongoRunner = null;

if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = "mongodb://localhost:27017";
    try
    {
        // test the default server
        var tmp = new MongoClient(connectionString);
        tmp.ListDatabaseNames();
    }
    catch
    {
        // couldn't connect; start an ephemeral Mongo instance
        mongoRunner = Mongo2Go.MongoDbRunner.Start();
        connectionString = mongoRunner.ConnectionString;
        Console.WriteLine($"[Mongo2Go] started embedded MongoDB at {connectionString}");
    }
}

var mongoDBSettings = new MongoDBSettings
{
    ConnectionString = connectionString,
    DatabaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME") ?? "SurveyDB",
    SurveysCollectionName = Environment.GetEnvironmentVariable("MONGODB_SURVEYS_COLLECTION") ?? "Surveys",
    UsersCollectionName = Environment.GetEnvironmentVariable("MONGODB_USERS_COLLECTION") ?? "Users"
};

// keep runner alive for app lifetime (dispose when app stops)
if (mongoRunner != null)
{
    builder.Services.AddSingleton(mongoRunner);
}

builder.Services.AddSingleton(mongoDBSettings);

// Register MongoDB client and services
builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoDBSettings.ConnectionString));
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<ISurveyService, SurveyService>();
builder.Services.AddScoped<IUserService, UserService>();

// Configure JWT Authentication
var secretKey = Environment.GetEnvironmentVariable("SECRET") ?? "your-secret-key-change-this-in-production";
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
