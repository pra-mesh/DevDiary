using AutoMapper;
using DevDiary.Data.Entities;
using DevDiary.Data.Repositories;
using DevDiary.DTO.Request;
using DevDiary.DTO.Response;
using Microsoft.AspNetCore.Mvc;

namespace DevDiary.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EntriesController : ControllerBase
{
    private readonly IEntryRepository _entry;
    private readonly IMapper _mapper;

    public EntriesController(IEntryRepository entry, IMapper mapper)
    {
        _entry = entry;
        _mapper = mapper;
    }
    [HttpGet]
    public async Task<IActionResult> Get(
        int page = 1, int pageSize = 10, string? CategoryID = null, string? search = null) =>
         Ok(_mapper.Map<List<DiaryEntryResponse>>
            (await _entry.GetEntries(page, pageSize, CategoryID, search)));

    [HttpGet("{ID}")]
    public async Task<IActionResult> Get(Guid ID)
    {
        var result = await _entry.GetByID(ID);
        return Ok(_mapper.Map<DiaryEntryResponse>(result));
    }

    [HttpPost]
    public async Task<IActionResult> Insert(DiaryEntryRequest req)
    {
        var result = await _entry.Insert(_mapper.Map<DiaryEntry>(req));
        return Ok(_mapper.Map<DiaryEntryResponse>(result));
    }

    [HttpPut("{ID}")]
    public async Task<IActionResult> Update(Guid ID, DiaryEntryRequest req)
    {
        var result = await _entry.Update(_mapper.Map<DiaryEntry>(req), ID);
        return Ok(_mapper.Map<DiaryEntryResponse>(result));
    }
    [HttpDelete("{ID}")]
    public async Task<IActionResult> Delete(Guid ID)
    {
        if (await _entry.Remove(ID))
            return Ok("Entry has been deleted");
        return BadRequest("Something went wrong");
    }
}
