# DevDiary AWS EC2 Deployment Guide

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Key pair for EC2 access
4. Domain name (optional, for production)

## Step 1: Launch EC2 Instance

### Instance Configuration
- **AMI**: Windows Server 2022 Base (or Ubuntu 22.04 LTS for Linux)
- **Instance Type**: t3.medium (minimum for SQL Server)
- **Storage**: 30GB GP3 SSD minimum
- **Security Group**: Configure ports 80, 443, 1433 (SQL Server), 3389 (RDP for Windows)

### Security Group Rules
```
Type            Protocol    Port Range    Source
HTTP            TCP         80           0.0.0.0/0
HTTPS           TCP         443          0.0.0.0/0
SQL Server      TCP         1433         Your IP/VPC only
RDP (Windows)   TCP         3389         Your IP only
SSH (Linux)     TCP         22           Your IP only
Custom          TCP         5234         0.0.0.0/0 (API port)
```

## Step 2: Connect to Your Instance

### For Windows:
1. Download RDP file from AWS Console
2. Connect using Remote Desktop Connection
3. Use the Administrator password from AWS Console

### For Linux:
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 3: Install Prerequisites

### Windows Server Setup:
```powershell
# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install .NET 8 SDK
choco install dotnet-8.0-sdk -y

# Install SQL Server Express
choco install sql-server-express -y

# Install SQL Server Management Studio (optional)
choco install sql-server-management-studio -y

# Install IIS
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-HttpErrors, IIS-HttpLogging, IIS-RequestFiltering, IIS-StaticContent, IIS-DefaultDocument, IIS-DirectoryBrowsing, IIS-ASPNET45
```

### Ubuntu Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install .NET 8
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-8.0

# Install SQL Server for Linux
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list)"
sudo apt update
sudo apt install -y mssql-server

# Configure SQL Server
sudo /opt/mssql/bin/mssql-conf setup

# Install SQL Server command-line tools
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
sudo apt update
sudo apt install -y mssql-tools unixodbc-dev

# Add tools to PATH
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
source ~/.bashrc

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

## Step 4: Configure SQL Server

### Create Database and User:
```sql
-- Connect to SQL Server
-- For Windows: Use SQL Server Management Studio or sqlcmd
-- For Linux: sqlcmd -S localhost -U sa

CREATE DATABASE DevDiaryDB;
GO

USE DevDiaryDB;
GO

-- Create application user
CREATE LOGIN devdiary_user WITH PASSWORD = 'YourStrongPassword123!';
CREATE USER devdiary_user FOR LOGIN devdiary_user;
ALTER ROLE db_owner ADD MEMBER devdiary_user;
GO
```

### Configure SQL Server for Remote Access:
```sql
-- Enable TCP/IP and set port
EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', 
    N'Software\Microsoft\MSSQLServer\MSSQLServer', 
    N'LoginMode', REG_DWORD, 2;

-- Restart SQL Server service after this change
```

## Step 5: Prepare Application for Deployment

### Update Connection String
Create production appsettings:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=DevDiaryDB;User Id=devdiary_user;Password=YourStrongPassword123!;TrustServerCertificate=True;MultipleActiveResultSets=true;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## Step 6: Deploy the Application

### Build and Publish Locally:
```bash
# Navigate to your DevDiary project
cd DevDiary

# Publish the application
dotnet publish -c Release -o ./publish --self-contained false --runtime win-x64
# For Linux: --runtime linux-x64
```

### Transfer Files to EC2:
```bash
# For Windows (using SCP or WinSCP)
scp -i your-key.pem -r ./publish/* administrator@your-ec2-ip:C:\inetpub\wwwroot\

# For Linux
scp -i your-key.pem -r ./publish/* ubuntu@your-ec2-ip:~/devdiary/
```

## Step 7: Configure Web Server

### Windows IIS Configuration:
```powershell
# Install ASP.NET Core Hosting Bundle
# Download from: https://dotnet.microsoft.com/download/dotnet/8.0

# Create IIS Application
Import-Module WebAdministration
New-WebApplication -Name "DevDiary" -Site "Default Web Site" -PhysicalPath "C:\inetpub\wwwroot\publish" -ApplicationPool "DefaultAppPool"

# Configure Application Pool
Set-ItemProperty -Path "IIS:\AppPools\DefaultAppPool" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
Set-ItemProperty -Path "IIS:\AppPools\DefaultAppPool" -Name "enable32BitAppOnWin64" -Value $false
```

### Linux Nginx Configuration:
```bash
# Create systemd service file
sudo nano /etc/systemd/system/devdiary.service
```

Add this content:
```ini
[Unit]
Description=DevDiary ASP.NET Core App
After=network.target

[Service]
Type=notify
ExecStart=/usr/bin/dotnet /home/ubuntu/devdiary/DevDiary.dll
Restart=always
RestartSec=5
KillSignal=SIGINT
SyslogIdentifier=devdiary
User=ubuntu
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
WorkingDirectory=/home/ubuntu/devdiary

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start the service
sudo systemctl enable devdiary.service
sudo systemctl start devdiary.service
sudo systemctl status devdiary.service

# Configure Nginx
sudo nano /etc/nginx/sites-available/devdiary
```

Add Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 public IP
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/devdiary /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 8: Run Database Migrations

```bash
# On the EC2 instance, navigate to your application directory
cd /path/to/your/published/app

# Run migrations
dotnet ef database update --connection "your-connection-string"
```

## Step 9: Configure Firewall and Security

### Windows Firewall:
```powershell
# Allow HTTP and HTTPS
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol TCP -LocalPort 80
New-NetFirewallRule -DisplayName "Allow HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443
New-NetFirewallRule -DisplayName "Allow API" -Direction Inbound -Protocol TCP -LocalPort 5234
```

### Linux UFW:
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5000
sudo ufw enable
```

## Step 10: SSL Certificate (Production)

### Using Let's Encrypt (Linux):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Using AWS Certificate Manager:
1. Request certificate in ACM
2. Set up Application Load Balancer
3. Configure target groups pointing to your EC2 instance

## Step 11: Monitoring and Maintenance

### CloudWatch Setup:
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm
```

### Log Management:
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/devdiary
```

## Troubleshooting

### Common Issues:
1. **Connection refused**: Check security groups and firewall rules
2. **Database connection failed**: Verify SQL Server is running and connection string is correct
3. **502 Bad Gateway**: Check if the .NET application is running
4. **Permission denied**: Ensure proper file permissions and user contexts

### Useful Commands:
```bash
# Check application logs
sudo journalctl -u devdiary.service -f

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check SQL Server status (Linux)
sudo systemctl status mssql-server

# Test database connection
sqlcmd -S localhost -U devdiary_user -P 'YourPassword' -Q "SELECT 1"
```

## Cost Optimization

1. **Use Reserved Instances** for long-term deployments
2. **Auto Scaling Groups** for variable load
3. **RDS instead of EC2 SQL Server** for managed database
4. **CloudFront CDN** for static content delivery
5. **Elastic Load Balancer** for high availability

## Security Best Practices

1. **Regular Updates**: Keep OS and software updated
2. **Backup Strategy**: Implement automated backups
3. **Access Control**: Use IAM roles and least privilege principle
4. **Network Security**: Use VPC, private subnets for database
5. **Monitoring**: Set up CloudWatch alarms and logging