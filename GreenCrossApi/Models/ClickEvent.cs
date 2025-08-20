using System.ComponentModel.DataAnnotations;
namespace GreenCrossApi.Models
{
  public class ClickEvent
  {
    [Key]
    public int DayNo { get; set; }
    public string Colour { get; set; }

    public string Description { get; set; }
  }
}