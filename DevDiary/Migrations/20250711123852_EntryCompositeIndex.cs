using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevDiary.Migrations
{
    /// <inheritdoc />
    public partial class EntryCompositeIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_DiaryEntries_CreatedAt_Id",
                table: "DiaryEntries",
                columns: new[] { "CreatedAt", "Id" },
                descending: new[] { true, false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DiaryEntries_CreatedAt_Id",
                table: "DiaryEntries");
        }
    }
}
