#!/bin/bash

# Database Migration Script for DevDiary
# Run this script on the EC2 instance after application deployment

set -e

APP_DIR="/home/ubuntu/devdiary"
DB_NAME="DevDiaryDB"
DB_USER="devdiary_user"
DB_PASSWORD="DevDiary2024!@#$"

echo "Starting database migration process..."

# Check if SQL Server is running
if ! sudo systemctl is-active --quiet mssql-server; then
    echo "SQL Server is not running. Starting SQL Server..."
    sudo systemctl start mssql-server
    sleep 10
fi

# Check if sqlcmd is available
if ! command -v sqlcmd &> /dev/null; then
    echo "sqlcmd not found. Please install SQL Server tools first."
    exit 1
fi

# Test database connection
echo "Testing database connection..."
if sqlcmd -S localhost -U $DB_USER -P "$DB_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1; then
    echo "Database connection successful!"
else
    echo "Database connection failed. Please check your credentials and SQL Server configuration."
    exit 1
fi

# Navigate to application directory
cd $APP_DIR

# Check if Entity Framework tools are available
if ! dotnet tool list -g | grep -q "dotnet-ef"; then
    echo "Installing Entity Framework tools..."
    dotnet tool install --global dotnet-ef
    export PATH="$PATH:$HOME/.dotnet/tools"
fi

# Run database migrations
echo "Running database migrations..."
CONNECTION_STRING="Server=localhost;Database=$DB_NAME;User Id=$DB_USER;Password=$DB_PASSWORD;TrustServerCertificate=True;MultipleActiveResultSets=true;"

dotnet ef database update --connection "$CONNECTION_STRING" --verbose

if [ $? -eq 0 ]; then
    echo "Database migrations completed successfully!"
else
    echo "Database migration failed!"
    exit 1
fi

# Verify database setup
echo "Verifying database setup..."
sqlcmd -S localhost -U $DB_USER -P "$DB_PASSWORD" -d $DB_NAME -Q "
SELECT 
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
"

echo "Database migration process completed!"
echo "Your DevDiary database is ready to use."