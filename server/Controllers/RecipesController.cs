using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using server.Middleware;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints
    public class RecipesController : ControllerBase
    {
        private readonly MyAppContext _context;
        private readonly ILogger<RecipesController> _logger;

        public RecipesController(MyAppContext context, ILogger<RecipesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Recipes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeDTO>>> GetAllRecipesByUser([FromQuery] string? username = null)
        {
            // Get all recipes from all users
            var allRecipes = await _context.Recipes
                .Include(r => r.User)
                .ToListAsync();
            
            var recipeDTOs = allRecipes.Select(recipe => {
                var dto = ConvertToDTO(recipe);
                dto.Username = recipe.User?.Username;
                return dto;
            }).ToList();
            
            return Ok(recipeDTOs);
        }

        // GET: api/Recipes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound();
            }

            return recipe;
        }

        // GET: api/Recipes/my
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<RecipeDTO>>> GetMyRecipes()
        {
            // Get the current user's ID from the token
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            // Find the current user
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null)
            {
                return BadRequest("User not found");
            }
            
            // Get only recipes that belong to the current user
            var userRecipes = await _context.Recipes
                .Where(r => r.UserId == currentUserId)
                .Include(r => r.User)
                .ToListAsync();
            
            var recipeDTOs = userRecipes.Select(recipe => {
                var dto = ConvertToDTO(recipe);
                dto.Username = recipe.User?.Username;
                return dto;
            }).ToList();
            
            return Ok(recipeDTOs);
        }

        // POST: api/Recipes
        [HttpPost]
        public async Task<ActionResult<RecipeDTO>> PostRecipe(Recipe recipe)
        {
            // Get the current user's ID from the token
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            // Find the user
            var user = await _context.Users.FindAsync(currentUserId);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            // Set the recipe's UserId
            recipe.UserId = currentUserId;
            
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            var recipeDTO = ConvertToDTO(recipe);
            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipeDTO);
        }

        // PUT: api/Recipes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, Recipe recipe)
        {
            if (id != recipe.Id)
            {
                return BadRequest();
            }

            // Get the current user's ID from the token
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            // Get current user to check role
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null)
            {
                return BadRequest("Current user not found");
            }

            // Check if user is admin
            bool isAdmin = currentUser.Role == "admin";
            
            // Find the existing recipe
            var existingRecipe = await _context.Recipes.FindAsync(id);
            if (existingRecipe == null)
            {
                return NotFound();
            }

            // Check if the current user owns this recipe or is an admin
            if (existingRecipe.UserId != currentUserId && !isAdmin)
            {
                return StatusCode(403, new { message = "You can only modify your own recipes or need admin privileges" });
            }

            // If not admin, ensure recipe belongs to current user
            if (!isAdmin)
            {
                recipe.UserId = currentUserId;
            }
            // If admin, preserve the original owner
            else
            {
                recipe.UserId = existingRecipe.UserId;
            }

            // Detach any existing entity with the same ID
            var existingEntry = _context.ChangeTracker.Entries<Recipe>()
                .FirstOrDefault(e => e.Entity.Id == id);
            if (existingEntry != null)
            {
                existingEntry.State = EntityState.Detached;
            }
            
            // Update the recipe
            _context.Update(recipe);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Recipes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null)
            {
                return NotFound();
            }

            // Get the current user's ID from the token
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            // Get current user to check role
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null)
            {
                return BadRequest("Current user not found");
            }

            // Check if user is admin
            bool isAdmin = currentUser.Role == "admin";

            // Check if the current user owns this recipe or is an admin
            if (recipe.UserId != currentUserId && !isAdmin)
            {
                return StatusCode(403, new { message = "You can only delete your own recipes or need admin privileges" });
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static RecipeDTO ConvertToDTO(Recipe recipe)
        {
            return new RecipeDTO
            {
                Id = recipe.Id,
                RecipeName = recipe.RecipeName,
                ImageUrl = recipe.ImageUrl,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                Category = recipe.Category
            };
        }

        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.Id == id);
        }
    }
} 