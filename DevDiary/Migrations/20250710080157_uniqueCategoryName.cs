using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevDiary.Migrations
{
    /// <inheritdoc />
    public partial class uniqueCategoryName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DiaryCategories_Name",
                table: "DiaryCategories");

            migrationBuilder.CreateIndex(
                name: "IX_DiaryCategories_Name",
                table: "DiaryCategories",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DiaryCategories_Name",
                table: "DiaryCategories");

            migrationBuilder.CreateIndex(
                name: "IX_DiaryCategories_Name",
                table: "DiaryCategories",
                column: "Name");
        }
    }
}
