namespace server.Models
{
    public class RecipeDTO
    {
        public int Id { get; set; }
        public string RecipeName { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public string Ingredients { get; set; } = null!;
        public string Instructions { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string? Username { get; set; }
    }
} 