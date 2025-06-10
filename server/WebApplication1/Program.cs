using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Xml;
using Newtonsoft.Json;



// условная бд с пользователями
var people = new List<Person>
 {
    new Person("tom@gmail.com", "12345"),
    new Person("bob@gmail.com", "55555")
};

var builder = WebApplication.CreateBuilder();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = AuthOptions.ISSUER,
            ValidateAudience = true,
            ValidAudience = AuthOptions.AUDIENCE,
            ValidateLifetime = true,
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            ValidateIssuerSigningKey = true
        };
    });
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/login", (Person loginData) =>
{
    // находим пользователя 
    Person? person = people.FirstOrDefault(p => p.Email == loginData.Email && p.Password == loginData.Password);
    // если пользователь не найден, отправляем статусный код 401
    if (person is null) return Results.Unauthorized();

    var claims = new List<Claim> { new Claim(ClaimTypes.Name, person.Email) };
    // создаем JWT-токен
    var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

    // формируем ответ
    var response = new
    {
        access_token = encodedJwt,
        username = person.Email
    };

    return Results.Json(response);
});
app.MapGet("/data", [Authorize] () => new { message = "Hello World!" });

// запист в json файл

app.MapPost("/api/data/save", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    string json = await reader.ReadToEndAsync();

    // Парсим новые данные
    var newData = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);

    // Путь к файлу
    string filePath = Path.Combine("wwwroot", "data", "logs.json");
    string directory = Path.GetDirectoryName(filePath);

    // Создаём папку, если её нет
    if (!Directory.Exists(directory))
        Directory.CreateDirectory(directory);

    List<Dictionary<string, string>> existingData = new();

    // Читаем старые данные из файла
    if (File.Exists(filePath))
    {
        string existingJson = await File.ReadAllTextAsync(filePath);
        existingData = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(existingJson) ?? new();
    }

    // Добавляем новые данные
    existingData.Add(newData);

    // Сохраняем обновлённый JSON
    string updatedJson = JsonConvert.SerializeObject(existingData, Newtonsoft.Json.Formatting.Indented);
    await File.WriteAllTextAsync(filePath, updatedJson);
    return Results.Ok();
});

// Карточки
app.MapGet("/api/data/load", (string filename) =>
{
    string filePath = Path.Combine("wwwroot", "data", filename + ".json");

    if (!File.Exists(filePath))
        return Results.NotFound("Файл не найден");

    var json = File.ReadAllText(filePath);
    return Results.Content(json, "application/json");
});
app.Run();
record class Person(string Email, string Password);

public class AuthOptions
{
    public const string ISSUER = "MyAuthServer"; // издатель токена
    public const string AUDIENCE = "MyAuthClient"; // потребитель токена
    const string KEY = "a-string-secret-at-least-256-bits-long";   // ключ для шифрации
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}