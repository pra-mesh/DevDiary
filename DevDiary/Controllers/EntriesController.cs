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
    [HttpPost]
    public async Task<IActionResult> Insert(DiaryEntryRequest req)
    {
        var result = await _entry.Insert(_mapper.Map<DiaryEntry>(req));
        return Ok(_mapper.Map<DiaryEntryResponse>(result));
    }
}
