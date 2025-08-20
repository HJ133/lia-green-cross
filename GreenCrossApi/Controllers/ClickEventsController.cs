using Microsoft.AspNetCore.Mvc;
using GreenCrossApi.Data;
using GreenCrossApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GreenCrossApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ClickEventsController : ControllerBase
  {

    private readonly AppDbContext _context;

    public ClickEventsController(AppDbContext context)
    {
      _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PostClick([FromBody] ClickEvent click)
    {
    var existingClick = await _context.ClickEvents
        .FirstOrDefaultAsync(c => c.DayNo == click.DayNo);

    if (existingClick != null)
    {
        existingClick.Colour = click.Colour;
        existingClick.Description = click.Description;

        _context.ClickEvents.Update(existingClick);
    }
    else
    {
        _context.ClickEvents.Add(click);
    }

    await _context.SaveChangesAsync();
    return Ok(click);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClickEvent>>> GetClicks()
    {
      return await _context.ClickEvents.ToListAsync();
    }
  }
}