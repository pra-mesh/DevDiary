using AutoMapper;
using DevDiary.Data.Entities;
using DevDiary.Data.Repositories;
using DevDiary.DTO.Request;
using DevDiary.DTO.Response;
using Microsoft.AspNetCore.Mvc;

namespace DevDiary.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _category;
    private readonly IMapper _mapper;

    public CategoriesController(ICategoryRepository category, IMapper mapper)
    {
        _category = category;
        _mapper = mapper;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(_mapper.Map<List<CategoryResponse>>(await _category.GetAllCategoryAsync()));
    [HttpPost]
    public async Task<IActionResult> AddCategory(CategoryRequest category)
    {
        var result = await _category.AddCategory(_mapper.Map<DiaryCategory>(category));
        return Ok(_mapper.Map<CategoryResponse>(result));
    }
    [HttpPatch("{ID}")]
    public async Task<IActionResult> Update
        (Guid ID, CategoryRequest category)
    {
        var result = await _category.UpdateCategory(_mapper.Map<DiaryCategory>(category), ID);
        return Ok(_mapper.Map<CategoryResponse>(result));
    }
    [HttpDelete("ID")]
    public async Task<IActionResult> Delete(Guid ID)
    {
        var result = await _category.DeleteCategory(ID);
        if (result)
            return Ok(new { Message = "Category was Delete successfully" });
        return BadRequest("Something went wrong");
    }

    [HttpGet("ID")]
    public async Task<IActionResult> Get(Guid ID)
    {
        var result = await _category.GetCategoryDetail(ID);
        return Ok(result);

    }

}
