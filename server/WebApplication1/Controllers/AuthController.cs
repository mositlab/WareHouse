using AuthPostgresDemo.Data;
using AuthPostgresDemo.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthPostgresDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                    return BadRequest("Email и пароль обязательны");

                if (_context.Users.Any(u => u.Email == request.Email))
                    return BadRequest("Пользователь уже существует");

                var user = new User
                {
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Пользователь зарегистрирован" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка регистрации: {ex.Message}");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                    return BadRequest("Email и пароль обязательны");

                var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    return Unauthorized("Неверный логин или пароль");

                var tokenHandler = new JwtSecurityTokenHandler();
                // Исправлено: используем UTF8 вместо ASCII
                var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                        new Claim(ClaimTypes.Email, user.Email)
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(
                        Convert.ToDouble(_configuration["JwtSettings:TokenValidityInMinutes"])),
                    Issuer = _configuration["JwtSettings:Issuer"],
                    Audience = _configuration["JwtSettings:Audience"],
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new { access_token = tokenString });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка входа: {ex.Message}");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
    // Контроллер для обработки запросов в таблицу Storage
    [ApiController]
    [Route("api/[controller]")]
    public class StorageControllers: ControllerBase
    {
        private readonly AppDbContext _context;
        public StorageControllers(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<storage1>>> GetStorage1()
        {
            return await _context.storage1.ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult<storage1>> CreateStorage1(storage1 storage1)
        {
            _context.storage1.Add(storage1);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetStorage1), new { id = storage1.id }, storage1);
        }
    }



    public class UserLoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserRegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}