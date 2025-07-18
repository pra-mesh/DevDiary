using AutoMapper;
using DevDiary.Data;
using DevDiary.Data.Repositories;
using DevDiary.Mapping;
using DevDiary.Middleware;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var loggerFactory = LoggerFactory.Create(builder =>
{
    builder.SetMinimumLevel(LogLevel.None);
    // No need to add AddConsole or AddDebug if you don't want any output
});

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddDbContext<ApplicationDbContext>(o =>
o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
sqlOptions => sqlOptions.CommandTimeout(300)
));

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IEntryRepository, EntryRepository>();
//NOTES Learn more about loggerFactory
//TODO use log factory
var mapperConfig = new MapperConfiguration(cfg =>
{
    cfg.AddProfile<DiaryMapProfile>();
}, loggerFactory);

IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

//NOTES for assembly registration
//var mapperConfig = new MapperConfiguration(cfg =>
//{
//    cfg.AddMaps(typeof(DiaryMapProfile).Assembly);
//});
//builder.Services.AddSingleton(mapperConfig.CreateMapper());

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//Add Cors
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAll", b =>
    {
        b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseAuthorization();

app.MapControllers();
using (var buildDb = app.Services.CreateScope())
{
    var context = buildDb.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();
    await DataSeeding.Initialize(context);
}

app.Run();
