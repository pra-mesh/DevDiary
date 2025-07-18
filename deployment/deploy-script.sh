#!/bin/bash

# DevDiary Deployment Script for Ubuntu EC2
# Run this script on your EC2 instance after initial setup

set -e

echo "Starting DevDiary deployment..."

# Variables - Update these
APP_NAME="devdiary"
APP_USER="ubuntu"
APP_DIR="/home/$APP_USER/$APP_NAME"
SERVICE_NAME="$APP_NAME.service"
NGINX_SITE="$APP_NAME"

# Create application directory
echo "Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown $APP_USER:$APP_USER $APP_DIR

# Install .NET 8 if not already installed
if ! command -v dotnet &> /dev/null; then
    echo "Installing .NET 8..."
    wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
    sudo dpkg -i packages-microsoft-prod.deb
    sudo apt update
    sudo apt install -y dotnet-sdk-8.0
    rm packages-microsoft-prod.deb
fi

# Install SQL Server if not already installed
if ! command -v sqlcmd &> /dev/null; then
    echo "Installing SQL Server..."
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
    sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list)"
    sudo apt update
    sudo apt install -y mssql-server
    
    echo "Please run 'sudo /opt/mssql/bin/mssql-conf setup' to configure SQL Server"
    
    # Install SQL Server tools
    curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
    curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
    sudo apt update
    sudo apt install -y mssql-tools unixodbc-dev
    
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
fi

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt install -y nginx
fi

# Create systemd service file
echo "Creating systemd service..."
sudo tee /etc/systemd/system/$SERVICE_NAME > /dev/null <<EOF
[Unit]
Description=DevDiary ASP.NET Core App
After=network.target

[Service]
Type=notify
ExecStart=/usr/bin/dotnet $APP_DIR/DevDiary.dll
Restart=always
RestartSec=5
KillSignal=SIGINT
SyslogIdentifier=$APP_NAME
User=$APP_USER
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
Environment=ASPNETCORE_URLS=http://localhost:5000
WorkingDirectory=$APP_DIR

[Install]
WantedBy=multi-user.target
EOF

# Create Nginx configuration
echo "Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/$NGINX_SITE > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Reload systemd and enable services
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl enable nginx

echo "Deployment script completed!"
echo ""
echo "Next steps:"
echo "1. Upload your published application files to $APP_DIR"
echo "2. Configure SQL Server: sudo /opt/mssql/bin/mssql-conf setup"
echo "3. Create database and run migrations"
echo "4. Start the application: sudo systemctl start $SERVICE_NAME"
echo "5. Start Nginx: sudo systemctl start nginx"
echo ""
echo "Check service status with:"
echo "  sudo systemctl status $SERVICE_NAME"
echo "  sudo systemctl status nginx"