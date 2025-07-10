using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevDiary.Migrations
{
    /// <inheritdoc />
    public partial class InitialDBCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DiaryCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Color = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiaryCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiaryEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CategoryID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Tags = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiaryEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiaryEntries_DiaryCategories_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "DiaryCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.Sql(
                        @"CREATE FULLTEXT CATALOG DiaryFTCatalog AS DEFAULT;",
                        suppressTransaction: true
                    );

            migrationBuilder.Sql(
                @"CREATE UNIQUE INDEX UX_Diary_Id ON DiaryEntries(Id);"
            // No need to suppress transaction here
            );

            migrationBuilder.Sql(
                @"CREATE FULLTEXT INDEX ON DiaryEntries(Content,Title,Tags Language 1033)
                      KEY INDEX UX_Diary_Id
                      WITH CHANGE_TRACKING AUTO;",
                                suppressTransaction: true
                            );


            migrationBuilder.CreateIndex(
                name: "IX_DiaryCategories_Name",
                table: "DiaryCategories",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_DiaryEntries_CategoryID",
                table: "DiaryEntries",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_DiaryEntries_Title",
                table: "DiaryEntries",
                column: "Title");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiaryEntries");

            migrationBuilder.DropTable(
                name: "DiaryCategories");
        }
    }
}
