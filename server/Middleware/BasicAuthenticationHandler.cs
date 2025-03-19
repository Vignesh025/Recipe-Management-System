using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using server.Data;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Middleware
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly MyAppContext _context;
        private readonly ILogger<BasicAuthenticationHandler> _logger;

#pragma warning disable CS0618 // Type or member is obsolete
        public BasicAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            MyAppContext context)
            : base(options, logger, encoder, clock)
#pragma warning restore CS0618 // Type or member is obsolete
        {
            _context = context;
            _logger = logger.CreateLogger<BasicAuthenticationHandler>();
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
                return AuthenticateResult.Fail("Missing Authorization Header");

            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();
                if (!authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    return AuthenticateResult.Fail("Invalid Authorization Header");

                var token = authHeader.Substring("Bearer ".Length).Trim();

                // Log the token for debugging
                _logger.LogInformation($"Authenticating with token: {token}");

                // Look up the user ID from the token store
                if (!TokenStore.TryGetUserId(token, out int userId))
                {
                    _logger.LogWarning($"Token not found: {token}");
                    return AuthenticateResult.Fail("Invalid token");
                }

                // Find the user by ID
                var user = await _context.Users.FindAsync(userId);
                
                if (user == null)
                {
                    _logger.LogWarning($"User not found for ID: {userId}");
                    return AuthenticateResult.Fail("User not found");
                }

                // Log the authenticated user
                _logger.LogInformation($"Authenticated as user: {user.Username} (ID: {user.Id})");

                // Create claims for the authenticated user
                var claims = new[] {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username)
                };

                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);

                return AuthenticateResult.Success(ticket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during authentication");
                return AuthenticateResult.Fail("Authentication failed");
            }
        }
    }
} 