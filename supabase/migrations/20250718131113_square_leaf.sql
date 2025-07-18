-- DevDiary Database Setup Script
-- Run this script after SQL Server installation

-- Create the database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DevDiaryDB')
BEGIN
    CREATE DATABASE DevDiaryDB;
    PRINT 'Database DevDiaryDB created successfully.';
END
ELSE
BEGIN
    PRINT 'Database DevDiaryDB already exists.';
END
GO

-- Use the database
USE DevDiaryDB;
GO

-- Create application login and user
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'devdiary_user')
BEGIN
    CREATE LOGIN devdiary_user WITH PASSWORD = 'DevDiary2024!@#$';
    PRINT 'Login devdiary_user created successfully.';
END
ELSE
BEGIN
    PRINT 'Login devdiary_user already exists.';
END
GO

-- Create database user
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'devdiary_user')
BEGIN
    CREATE USER devdiary_user FOR LOGIN devdiary_user;
    PRINT 'User devdiary_user created successfully.';
END
ELSE
BEGIN
    PRINT 'User devdiary_user already exists.';
END
GO

-- Grant permissions
ALTER ROLE db_owner ADD MEMBER devdiary_user;
PRINT 'Permissions granted to devdiary_user.';
GO

-- Enable SQL Server Authentication (mixed mode)
EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', 
    N'Software\Microsoft\MSSQLServer\MSSQLServer', 
    N'LoginMode', REG_DWORD, 2;
PRINT 'SQL Server authentication mode set to mixed mode.';
PRINT 'Please restart SQL Server service for this change to take effect.';
GO

-- Configure SQL Server for remote connections
EXEC sp_configure 'remote access', 1;
RECONFIGURE;
PRINT 'Remote access configured.';
GO

-- Show current configuration
SELECT 
    name,
    value,
    value_in_use,
    description
FROM sys.configurations
WHERE name IN ('remote access', 'user connections');
GO

PRINT 'Database setup completed successfully!';
PRINT 'Connection string: Server=localhost;Database=DevDiaryDB;User Id=devdiary_user;Password=DevDiary2024!@#$;TrustServerCertificate=True;';