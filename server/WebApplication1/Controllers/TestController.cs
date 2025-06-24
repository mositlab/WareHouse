using Microsoft.AspNetCore.Mvc;
using AuthPostgresDemo.Data;

namespace AuthPostgresDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var count = _context.Users.Count();
            return Ok(new { Count = count });
        }
    }
}