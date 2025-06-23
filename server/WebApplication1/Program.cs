using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

var builder = WebApplication.CreateBuilder();

// Настройка аутентификации JWT
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

builder.Services.AddAuthorization();
var app = builder.Build();

// Middleware
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

// Условная БД с пользователями
var people = new List<Person>
{
    new Person("tom@gmail.com", "12345"),
    new Person("bob@gmail.com", "55555")
};

// Авторизация через JWT
app.MapPost("/login", (Person loginData) =>
{
    // Поиск пользователя
    var person = people.FirstOrDefault(p => p.Email == loginData.Email && p.Password == loginData.Password);
    if (person is null) return Results.Unauthorized();

    // Генерация токена
    var claims = new List<Claim> { new Claim(ClaimTypes.Name, person.Email) };

    var jwt = new JwtSecurityToken(
        issuer: AuthOptions.ISSUER,
        audience: AuthOptions.AUDIENCE,
        claims: claims,
        expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

    return Results.Json(new
    {
        access_token = encodedJwt,
        username = person.Email
    });
});

// Получение данных по всем предметам или по конкретному складу
app.MapGet("/api/data/load", async (string? storageId) =>
{
    string filePath = Path.Combine("wwwroot", "data", "logs.json");

    if (!File.Exists(filePath))
        return Results.NotFound("Файл не найден");

    string json = await File.ReadAllTextAsync(filePath);
    var items = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(json);

    if (storageId != null)
    {
        items = items?
            .Where(i => i.ContainsKey("storageId") && i["storageId"] == storageId)
            .ToList();
    }
    else
    {
        items = items?.Where(i => i.ContainsKey("type") && i["type"] == "item").ToList();
    }

    return Results.Json(items ?? new List<Dictionary<string, string>>());
});

// Загрузка всех складов из JSON
app.MapGet("/api/storage/list", async () =>
{
    string filePath = Path.Combine("wwwroot", "data", "logs.json");

    if (!File.Exists(filePath))
        return Results.NotFound("Файл не найден");

    string json = await File.ReadAllTextAsync(filePath);
    var allItems = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(json);

    var storages = allItems?
        .Where(i => i.ContainsKey("type") && i["type"] == "storage")
        .ToList();

    return Results.Json(storages ?? new List<Dictionary<string, string>>());
});

// Сохранение любого объекта в JSON (предмет или склад)
app.MapPost("/api/data/save", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    string json = await reader.ReadToEndAsync();

    string filePath = Path.Combine("wwwroot", "data", "logs.json");
    string directory = Path.GetDirectoryName(filePath);

    if (!Directory.Exists(directory))
        Directory.CreateDirectory(directory);

    List<dynamic> existingData = new();

    if (File.Exists(filePath))
    {
        string existingJson = await File.ReadAllTextAsync(filePath);
        existingData = JsonConvert.DeserializeObject<List<dynamic>>(existingJson) ?? new();
    }

    var newData = JsonConvert.DeserializeObject(json);
    existingData.Add(newData);

    string updatedJson = JsonConvert.SerializeObject(existingData, Newtonsoft.Json.Formatting.Indented);
    await File.WriteAllTextAsync(filePath, updatedJson);

    return Results.Ok("Данные сохранены");
});

// Удаление элемента по ID
app.MapDelete("/data/delete/{id}", async (string id) =>
{
    string filePath = Path.Combine("wwwroot", "data", "logs.json");

    if (!File.Exists(filePath))
        return Results.NotFound("Файл не найден");

    string existingJson = await File.ReadAllTextAsync(filePath);
    var items = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(existingJson);

    var itemToRemove = items?.FirstOrDefault(i => i.ContainsKey("id") && i["id"] == id);
    if (itemToRemove == null)
        return Results.NotFound("Элемент не найден");

    items.Remove(itemToRemove);
    string updatedJson = JsonConvert.SerializeObject(items, Newtonsoft.Json.Formatting.Indented);
    await File.WriteAllTextAsync(filePath, updatedJson);

    return Results.Ok("Элемент удален");
});

app.Run();

public class AuthOptions
{
    public const string ISSUER = "MyAuthServer";
    public const string AUDIENCE = "MyAuthClient";
    const string KEY = "a-string-secret-at-least-256-bits-long";

    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}

record class Person(string Email, string Password);