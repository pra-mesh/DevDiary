using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevDiary.Migrations
{
    /// <inheritdoc />
    public partial class Description_Categories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "DiaryCategories",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "DiaryCategories");
        }
    }
}
