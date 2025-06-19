using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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

    return Results.Ok();
});

app.MapPost("/data/save", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    string json = await reader.ReadToEndAsync();

    // Путь к файлу
    string filePath = Path.Combine("wwwroot", "data", "logs.json");
    string directory = Path.GetDirectoryName(filePath);

    // Создаём папку, если её нет
    if (!Directory.Exists(directory))
        Directory.CreateDirectory(directory);

    List<dynamic> existingData = new();

    // Читаем старые данные из файла
    if (File.Exists(filePath))
    {
        string existingJson = await File.ReadAllTextAsync(filePath);
        existingData = JsonConvert.DeserializeObject<List<dynamic>>(existingJson) ?? new();
    }

    // Добавляем новые данные
    var newData = JsonConvert.DeserializeObject(json);
    existingData.Add(newData);

    // Сохраняем обратно в файл
    string updatedJson = JsonConvert.SerializeObject(existingData, Newtonsoft.Json.Formatting.Indented);
    await File.WriteAllTextAsync(filePath, updatedJson);

    return Results.Ok("Данные обновлены");
});
// Сохранение base64 в json
app.MapGet("/data/load", () =>
{
    string filePath = Path.Combine("wwwroot", "data", "logs.json");

    if (!File.Exists(filePath))
        return Results.NotFound("Файл logs.json не найден");

    string json = File.ReadAllText(filePath);
    return Results.Content(json, "application/json");
});
// Модальное окно удаления
app.MapDelete("/data/delete/{id}", async (string id) =>
{
    string filePath = Path.Combine("wwwroot", "data", "logs.json");

    if (!File.Exists(filePath))
        return Results.NotFound("Файл не найден");

    string existingJson = await File.ReadAllTextAsync(filePath);
    var items = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(existingJson);

    if (items == null)
        return Results.BadRequest("Не удалось прочитать файл");

    var itemToRemove = items.FirstOrDefault(i => i.ContainsKey("id") && i["id"] == id);
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
    public const string ISSUER = "MyAuthServer"; // издатель токена
    public const string AUDIENCE = "MyAuthClient"; // потребитель токена
    const string KEY = "a-string-secret-at-least-256-bits-long";   // ключ для шифрации
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}

record class Person(string Email, string Password);
