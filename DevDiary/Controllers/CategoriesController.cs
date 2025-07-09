using DevDiary.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DevDiary.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _category;

    public CategoriesController(ICategoryRepository category)
    {
        _category = category;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _category.GetAllCategoryAsync());




}
