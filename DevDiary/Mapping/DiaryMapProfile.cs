using AutoMapper;
using DevDiary.Data.Entities;
using DevDiary.DTO.Request;
using DevDiary.DTO.Response;

namespace DevDiary.Mapping;

public class DiaryMapProfile : Profile
{
    public DiaryMapProfile()
    {
        CreateMap<CategoryRequest, DiaryCategory>(); //ReverseMap() for reversing map
        CreateMap<DiaryCategory, CategoryResponse>();
        CreateMap<DiaryEntry, DiaryEntryResponse>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(dest => dest.CategoryColor, opt => opt.MapFrom(dest => dest.Category.Color))
            .ForMember(dest => dest.CategoryDescription, opt => opt.MapFrom(dest => dest.Category.Description));
        CreateMap<DiaryEntryRequest, DiaryEntry>();
    }
}
