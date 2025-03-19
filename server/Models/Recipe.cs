using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string RecipeName { get; set; } = null!;
        
        public string? ImageUrl { get; set; }
        
        [Required]
        public string Ingredients { get; set; } = null!;
        
        [Required]
        public string Instructions { get; set; } = null!;
        
        [Required]
        public string Category { get; set; } = null!;
        
        [ForeignKey("User")]
        public int UserId { get; set; }
        
        [NotMapped] // This prevents the User property from being included in model binding
        public virtual User? User { get; set; }
    }
}