# PowerShell script to build, publish, and deploy DevDiary to EC2
# Run this script from your local development machine

param(
    [Parameter(Mandatory=$true)]
    [string]$EC2Host,
    
    [Parameter(Mandatory=$true)]
    [string]$KeyPath,
    
    [string]$Username = "ubuntu",
    [string]$ProjectPath = ".\DevDiary",
    [string]$RemotePath = "/home/ubuntu/devdiary"
)

Write-Host "Starting DevDiary deployment process..." -ForegroundColor Green

# Check if required tools are installed
if (!(Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Error ".NET SDK is not installed or not in PATH"
    exit 1
}

if (!(Get-Command scp -ErrorAction SilentlyContinue)) {
    Write-Error "SCP is not available. Please install OpenSSH client or use WSL"
    exit 1
}

# Build and publish the application
Write-Host "Building and publishing application..." -ForegroundColor Yellow
Push-Location $ProjectPath

try {
    # Clean previous builds
    dotnet clean -c Release
    
    # Restore packages
    dotnet restore
    
    # Build the application
    dotnet build -c Release --no-restore
    
    # Publish the application
    $publishPath = ".\bin\Release\net8.0\publish"
    dotnet publish -c Release -o $publishPath --no-build --self-contained false
    
    Write-Host "Application published successfully to $publishPath" -ForegroundColor Green
    
    # Create deployment package
    $deploymentPackage = "devdiary-deployment.zip"
    if (Test-Path $deploymentPackage) {
        Remove-Item $deploymentPackage -Force
    }
    
    Compress-Archive -Path "$publishPath\*" -DestinationPath $deploymentPackage
    Write-Host "Deployment package created: $deploymentPackage" -ForegroundColor Green
    
} catch {
    Write-Error "Build/Publish failed: $_"
    Pop-Location
    exit 1
}

Pop-Location

# Transfer files to EC2
Write-Host "Transferring files to EC2 instance..." -ForegroundColor Yellow

try {
    # Copy deployment package
    scp -i $KeyPath "$ProjectPath\$deploymentPackage" "${Username}@${EC2Host}:~/"
    
    # Copy configuration files
    scp -i $KeyPath "deployment\appsettings.Production.json" "${Username}@${EC2Host}:~/appsettings.Production.json"
    scp -i $KeyPath "deployment\database-setup.sql" "${Username}@${EC2Host}:~/database-setup.sql"
    
    Write-Host "Files transferred successfully" -ForegroundColor Green
    
} catch {
    Write-Error "File transfer failed: $_"
    exit 1
}

# Execute deployment commands on EC2
Write-Host "Executing deployment commands on EC2..." -ForegroundColor Yellow

$deploymentCommands = @"
# Stop the application service if running
sudo systemctl stop devdiary.service 2>/dev/null || true

# Create application directory
sudo mkdir -p $RemotePath
sudo chown $Username`:$Username $RemotePath

# Extract application files
cd ~
unzip -o $deploymentPackage -d $RemotePath/

# Copy production configuration
cp ~/appsettings.Production.json $RemotePath/

# Set permissions
sudo chown -R $Username`:$Username $RemotePath
chmod +x $RemotePath/DevDiary

# Reload systemd and start services
sudo systemctl daemon-reload
sudo systemctl start devdiary.service
sudo systemctl enable devdiary.service

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check service status
echo "=== Service Status ==="
sudo systemctl status devdiary.service --no-pager -l
echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager -l

echo "Deployment completed successfully!"
"@

try {
    ssh -i $KeyPath "${Username}@${EC2Host}" $deploymentCommands
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Error "Deployment commands failed: $_"
    exit 1
}

# Clean up local files
Remove-Item "$ProjectPath\$deploymentPackage" -Force -ErrorAction SilentlyContinue

Write-Host "Deployment process completed!" -ForegroundColor Green
Write-Host "Your application should be accessible at: http://$EC2Host" -ForegroundColor Cyan
Write-Host "API endpoint: http://$EC2Host/api" -ForegroundColor Cyan

# Display next steps
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Configure SQL Server on the EC2 instance"
Write-Host "2. Run database migrations"
Write-Host "3. Update your frontend API URL to point to the EC2 instance"
Write-Host "4. Consider setting up SSL certificate for production use"