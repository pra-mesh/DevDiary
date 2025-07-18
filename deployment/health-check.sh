#!/bin/bash

# Health Check Script for DevDiary Deployment
# Run this script to verify all components are working correctly

echo "=== DevDiary Health Check ==="
echo "Timestamp: $(date)"
echo ""

# Check system resources
echo "1. System Resources:"
echo "   Memory Usage:"
free -h | grep -E "Mem|Swap"
echo "   Disk Usage:"
df -h | grep -E "/$|/home"
echo "   CPU Load:"
uptime
echo ""

# Check SQL Server
echo "2. SQL Server Status:"
if sudo systemctl is-active --quiet mssql-server; then
    echo "   ✓ SQL Server is running"
    
    # Test database connection
    if sqlcmd -S localhost -U devdiary_user -P "DevDiary2024!@#$" -Q "SELECT 1" > /dev/null 2>&1; then
        echo "   ✓ Database connection successful"
        
        # Check database tables
        TABLE_COUNT=$(sqlcmd -S localhost -U devdiary_user -P "DevDiary2024!@#$" -d DevDiaryDB -h -1 -Q "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'" | tr -d ' ')
        echo "   ✓ Database tables: $TABLE_COUNT"
    else
        echo "   ✗ Database connection failed"
    fi
else
    echo "   ✗ SQL Server is not running"
fi
echo ""

# Check DevDiary Application
echo "3. DevDiary Application:"
if sudo systemctl is-active --quiet devdiary.service; then
    echo "   ✓ DevDiary service is running"
    
    # Check if application is responding
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/Categories | grep -q "200"; then
        echo "   ✓ API is responding (Categories endpoint)"
    else
        echo "   ✗ API is not responding properly"
    fi
    
    # Check application logs for errors
    ERROR_COUNT=$(sudo journalctl -u devdiary.service --since "1 hour ago" | grep -i error | wc -l)
    if [ $ERROR_COUNT -eq 0 ]; then
        echo "   ✓ No errors in application logs (last hour)"
    else
        echo "   ⚠ Found $ERROR_COUNT errors in application logs (last hour)"
    fi
else
    echo "   ✗ DevDiary service is not running"
fi
echo ""

# Check Nginx
echo "4. Nginx Web Server:"
if sudo systemctl is-active --quiet nginx; then
    echo "   ✓ Nginx is running"
    
    # Test nginx configuration
    if sudo nginx -t > /dev/null 2>&1; then
        echo "   ✓ Nginx configuration is valid"
    else
        echo "   ✗ Nginx configuration has errors"
    fi
    
    # Check if web server is responding
    if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|502"; then
        echo "   ✓ Web server is responding"
    else
        echo "   ✗ Web server is not responding"
    fi
else
    echo "   ✗ Nginx is not running"
fi
echo ""

# Check network connectivity
echo "5. Network Connectivity:"
# Check if ports are listening
if netstat -tlnp | grep -q ":80 "; then
    echo "   ✓ Port 80 (HTTP) is listening"
else
    echo "   ✗ Port 80 (HTTP) is not listening"
fi

if netstat -tlnp | grep -q ":5000 "; then
    echo "   ✓ Port 5000 (Application) is listening"
else
    echo "   ✗ Port 5000 (Application) is not listening"
fi

if netstat -tlnp | grep -q ":1433 "; then
    echo "   ✓ Port 1433 (SQL Server) is listening"
else
    echo "   ✗ Port 1433 (SQL Server) is not listening"
fi
echo ""

# Check firewall status
echo "6. Firewall Status:"
if sudo ufw status | grep -q "Status: active"; then
    echo "   ✓ UFW firewall is active"
    echo "   Open ports:"
    sudo ufw status | grep ALLOW | sed 's/^/     /'
else
    echo "   ⚠ UFW firewall is not active"
fi
echo ""

# Performance metrics
echo "7. Performance Metrics:"
echo "   Application Memory Usage:"
ps aux | grep DevDiary | grep -v grep | awk '{print "     PID: " $2 ", Memory: " $4 "%, CPU: " $3 "%"}'

echo "   SQL Server Memory Usage:"
ps aux | grep sqlservr | grep -v grep | awk '{print "     PID: " $2 ", Memory: " $4 "%, CPU: " $3 "%"}'
echo ""

# Recent logs
echo "8. Recent Application Logs (last 10 lines):"
sudo journalctl -u devdiary.service -n 10 --no-pager | sed 's/^/   /'
echo ""

echo "=== Health Check Complete ==="

# Summary
echo "Summary:"
ISSUES=0

if ! sudo systemctl is-active --quiet mssql-server; then
    echo "  ⚠ SQL Server needs attention"
    ((ISSUES++))
fi

if ! sudo systemctl is-active --quiet devdiary.service; then
    echo "  ⚠ DevDiary application needs attention"
    ((ISSUES++))
fi

if ! sudo systemctl is-active --quiet nginx; then
    echo "  ⚠ Nginx web server needs attention"
    ((ISSUES++))
fi

if [ $ISSUES -eq 0 ]; then
    echo "  ✓ All services are running normally"
else
    echo "  ⚠ $ISSUES service(s) need attention"
fi

echo ""
echo "For detailed logs, use:"
echo "  sudo journalctl -u devdiary.service -f"
echo "  sudo journalctl -u nginx.service -f"
echo "  sudo tail -f /var/opt/mssql/log/errorlog"