using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.Security.Cryptography;
using System.Text;
using server.Middleware;
namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MyAppContext _context;
        private readonly ILogger<AuthController> _logger;

        public class RegisterModel
        {
            public string Username { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        public class LoginModel
        {
            public string Username { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        public AuthController(MyAppContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                return BadRequest("Username already exists");
            }

            // Create new user
            var user = new User
            {
                Username = model.Username,
                Password = HashPassword(model.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"User registered: {user.Username} (ID: {user.Id})");

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == model.Username);

            if (user == null || user.Password != HashPassword(model.Password))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            // Generate a token
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

            // Store the token with the user ID
            TokenStore.StoreToken(token, user.Id);

            _logger.LogInformation($"User logged in: {user.Username} (ID: {user.Id}) with token: {token}");

            return Ok(new
            {
                message = "Login successful",
                userId = user.Id,
                username = user.Username,
                token = token,
                role = user.Role
            });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
} 