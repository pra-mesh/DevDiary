Build started...
Build succeeded.
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [DiaryCategories] (
    [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(100) NOT NULL,
    [Color] nvarchar(100) NULL,
    CONSTRAINT [PK_DiaryCategories] PRIMARY KEY ([Id])
);

CREATE TABLE [DiaryEntries] (
    [Id] uniqueidentifier NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    [CategoryID] uniqueidentifier NOT NULL,
    [Tags] nvarchar(1000) NOT NULL,
    CONSTRAINT [PK_DiaryEntries] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DiaryEntries_DiaryCategories_CategoryID] FOREIGN KEY ([CategoryID]) REFERENCES [DiaryCategories] ([Id]) ON DELETE NO ACTION
);

COMMIT;
GO

CREATE FULLTEXT CATALOG DiaryFTCatalog AS DEFAULT;
GO

BEGIN TRANSACTION;
CREATE UNIQUE INDEX UX_Diary_Id ON DiaryEntries(Id);

COMMIT;
GO

CREATE FULLTEXT INDEX ON DiaryEntries(Content,Title,Tags Language 1033)
                      KEY INDEX UX_Diary_Id
                      WITH CHANGE_TRACKING AUTO;
GO

BEGIN TRANSACTION;
CREATE INDEX [IX_DiaryCategories_Name] ON [DiaryCategories] ([Name]);

CREATE INDEX [IX_DiaryEntries_CategoryID] ON [DiaryEntries] ([CategoryID]);

CREATE INDEX [IX_DiaryEntries_Title] ON [DiaryEntries] ([Title]);

COMMIT;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250710022303_InitialDBCreate', N'9.0.7');
GO

BEGIN TRANSACTION;
DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DiaryEntries]') AND [c].[name] = N'Id');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [DiaryEntries] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [DiaryEntries] ADD DEFAULT (NEWSEQUENTIALID()) FOR [Id];

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DiaryCategories]') AND [c].[name] = N'Id');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [DiaryCategories] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [DiaryCategories] ADD DEFAULT (NEWID()) FOR [Id];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250710024124_Guid_Generate', N'9.0.7');

ALTER TABLE [DiaryCategories] ADD [Description] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250710074407_Description_Categories', N'9.0.7');

DROP INDEX [IX_DiaryCategories_Name] ON [DiaryCategories];

CREATE UNIQUE INDEX [IX_DiaryCategories_Name] ON [DiaryCategories] ([Name]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250710080157_uniqueCategoryName', N'9.0.7');

CREATE INDEX [IX_DiaryEntries_CreatedAt_Id] ON [DiaryEntries] ([CreatedAt] DESC, [Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250711123852_EntryCompositeIndex', N'9.0.7');

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DiaryCategories]') AND [c].[name] = N'Description');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [DiaryCategories] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [DiaryCategories] ALTER COLUMN [Description] nvarchar(255) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250713092207_Categories_Description_length', N'9.0.7');

ALTER TABLE [DiaryEntries] ADD [IsPublished] bit NOT NULL DEFAULT CAST(0 AS bit);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250715021708_Add_PublishStatus_EntrySchema', N'9.0.7');

COMMIT;
GO


