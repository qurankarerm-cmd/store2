# 🪟 Windows Docker Deployment Guide

Complete guide for deploying Arabic Polymer Clay Store on Windows using Docker.

## 📋 Prerequisites

### 1. System Requirements
- **Windows 10/11** (64-bit) with WSL 2 support
- **8GB RAM minimum** (16GB recommended)
- **20GB free disk space**
- **Hyper-V enabled** (automatically enabled by Docker Desktop)

### 2. Install Docker Desktop for Windows

#### Download and Install
1. Visit [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-installer/)
2. Download `Docker Desktop Installer.exe`
3. Run the installer with administrator privileges
4. During installation, ensure these options are checked:
   - ✅ Enable Hyper-V Windows Features
   - ✅ Install required Windows components for WSL 2

#### Post-Installation Setup
1. **Restart your computer** after installation
2. **Start Docker Desktop** from Start Menu
3. **Accept the license agreement**
4. **Sign in or create Docker account** (optional but recommended)

#### Verify Installation
Open **PowerShell** or **Command Prompt** and run:
```powershell
docker --version
docker-compose --version
```

Expected output:
```
Docker version 24.0.x, build xxxxxxx
Docker Compose version v2.x.x
```

### 3. Configure Docker Desktop

#### Memory and CPU Settings
1. Open **Docker Desktop**
2. Go to **Settings** (gear icon)
3. Navigate to **Resources** → **Advanced**
4. Configure:
   - **Memory**: 6GB minimum (8GB recommended)
   - **CPUs**: 4 cores minimum
   - **Disk**: 60GB minimum
5. Click **Apply & Restart**

#### WSL 2 Integration (Recommended)
1. In Docker Desktop settings
2. Go to **General**
3. Ensure **Use WSL 2 based engine** is checked
4. Go to **Resources** → **WSL Integration**
5. Enable integration with your WSL distributions

## 🚀 Deployment Options

### Option 1: Using Windows Batch Script (Recommended)

#### Step 1: Navigate to Project Directory
```powershell
cd "C:\Users\Admin\Desktop\New folder\arabic-clay-store"
```

#### Step 2: Run the Setup Script
```powershell
# Double-click docker-setup.bat in File Explorer
# OR run from Command Prompt:
docker-setup.bat
```

#### Step 3: Choose Deployment Type
The script will show you options:
```
1) 🚀 Production Setup (Build and run all services)
2) 🔧 Development Setup (With hot reload)
3) 🧹 Clean Up (Remove all containers and volumes)
4) 📊 View Logs
5) 🔍 Check Status
6) 🛑 Stop All Services
7) ❌ Exit
```

**For production**: Choose option `1`
**For development**: Choose option `2`

### Option 2: Manual PowerShell Commands

#### Production Deployment
```powershell
# Navigate to project directory
cd "C:\Users\Admin\Desktop\New folder\arabic-clay-store"

# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Development Deployment
```powershell
# Navigate to project directory
cd "C:\Users\Admin\Desktop\New folder\arabic-clay-store"

# Build and start development services with hot reload
docker-compose -f docker-compose.dev.yml up --build -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Option 3: Using NPM Scripts
```powershell
# Production
npm run docker:prod

# Development
npm run docker:dev

# View logs
npm run docker:logs

# Stop services
npm run docker:stop
```

## 🌐 Accessing the Application

Once deployment is complete, access your application at:

| Service | URL | Description |
|---------|-----|-------------|
| **Public Website** | http://localhost:3000 | Arabic RTL storefront |
| **Admin Dashboard** | http://localhost:3001 | Management panel |
| **API Server** | http://localhost:5000 | REST API |
| **API Health Check** | http://localhost:5000/api/health | Server status |

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## 🔧 Windows-Specific Management

### Using Docker Desktop GUI

#### Monitor Services
1. Open **Docker Desktop**
2. Go to **Containers** tab
3. You'll see running containers:
   - `arabic_clay_mongodb`
   - `arabic_clay_server`
   - `arabic_clay_client`
   - `arabic_clay_admin`

#### View Logs via GUI
1. Click on any container name
2. Go to **Logs** tab
3. View real-time logs

#### Manage Volumes
1. Go to **Volumes** tab in Docker Desktop
2. You'll see persistent storage:
   - `arabic_clay_mongodb_data`
   - `arabic_clay_uploads_data`

### PowerShell Commands

#### Service Management
```powershell
# Check running containers
docker ps

# View specific service logs
docker logs arabic_clay_server
docker logs arabic_clay_client
docker logs arabic_clay_admin
docker logs arabic_clay_mongodb

# Restart a specific service
docker restart arabic_clay_server

# Stop all services
docker-compose down

# Start stopped services
docker-compose up -d
```

#### Database Management
```powershell
# Access MongoDB shell
docker exec -it arabic_clay_mongodb mongosh -u admin -p admin123

# Backup database
docker exec arabic_clay_mongodb mongodump --out /backup

# View database files
docker exec -it arabic_clay_mongodb ls -la /data/db
```

#### File Management
```powershell
# Copy files from container
docker cp arabic_clay_server:/app/uploads ./local-uploads

# Copy files to container
docker cp ./local-file.txt arabic_clay_server:/app/
```

## 🛠️ Development Workflow on Windows

### Hot Reload Setup
```powershell
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Your code changes will be reflected immediately:
# - Edit files in VS Code or any editor
# - Changes auto-reload in containers
# - No need to rebuild containers
```

### Code Editing
1. **Open project in VS Code**:
   ```powershell
   code "C:\Users\Admin\Desktop\New folder\arabic-clay-store"
   ```

2. **Edit files normally**:
   - Server files: `server/`
   - Client files: `client/`
   - Admin files: `admin-dashboard/`

3. **Changes are automatically synchronized** with containers

### Debugging
```powershell
# View real-time logs
docker-compose -f docker-compose.dev.yml logs -f

# Access container shell for debugging
docker exec -it arabic_clay_server sh
docker exec -it arabic_clay_client sh
```

## 🔍 Troubleshooting Windows Issues

### Common Windows Problems

#### Problem: "Docker daemon is not running"
**Solution**:
```powershell
# 1. Start Docker Desktop manually
# 2. Wait for it to fully start (whale icon in system tray)
# 3. Try the command again
```

#### Problem: "Port already in use"
**Solution**:
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID 1234 /F

# Or use different ports in docker-compose.yml
```

#### Problem: "Access denied" or "Permission denied"
**Solution**:
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → "Run as administrator"

# Or check Docker Desktop is running with proper permissions
```

#### Problem: "Out of disk space"
**Solution**:
```powershell
# Clean Docker system
docker system prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
docker system df
```

#### Problem: WSL 2 Issues
**Solution**:
```powershell
# Update WSL to latest version
wsl --update

# Restart WSL
wsl --shutdown

# Restart Docker Desktop
```

### Performance Issues

#### Slow Build Times
```powershell
# Clear Docker cache
docker builder prune -a

# Restart Docker Desktop
# Docker Desktop → Troubleshoot → Restart Docker Desktop
```

#### High Memory Usage
1. **Reduce Docker Desktop memory allocation**:
   - Docker Desktop → Settings → Resources → Advanced
   - Set Memory to 4GB for basic usage

2. **Close unnecessary applications**

3. **Monitor usage**:
   ```powershell
   docker stats
   ```

## 🛡️ Windows Security Considerations

### Windows Defender
- **Add Docker folder to exclusions**:
  - Windows Security → Virus & threat protection
  - Add exclusion for `C:\Program Files\Docker`

### Firewall Settings
- **Docker Desktop automatically configures** Windows Firewall
- **Manual configuration** (if needed):
  - Allow `Docker Desktop` through Windows Firewall
  - Allow ports: 3000, 3001, 5000

### User Permissions
```powershell
# Add user to docker-users group (if needed)
# Computer Management → Local Users and Groups → Groups
# Add user to "docker-users" group
```

## 📊 Monitoring and Maintenance

### Regular Maintenance
```powershell
# Weekly cleanup
docker system prune -f

# Monthly cleanup (removes everything unused)
docker system prune -a -f
docker volume prune -f
```

### Health Monitoring
```powershell
# Check all services health
docker-compose ps

# Check individual service health
docker inspect --format='{{.State.Health.Status}}' arabic_clay_server
```

### Backup Strategy
```powershell
# Backup database
docker exec arabic_clay_mongodb mongodump --archive=backup.archive

# Backup uploads
docker cp arabic_clay_server:/app/uploads ./uploads-backup

# Backup to external drive
copy .\uploads-backup "D:\Backups\arabic-clay-$(Get-Date -Format 'yyyy-MM-dd')"
```

## 🌐 Production Deployment on Windows Server

### For Windows Server Deployment

#### Prerequisites
- **Windows Server 2019/2022**
- **Docker Enterprise** or **Docker Desktop** (for development)
- **IIS with ARR** (for reverse proxy)

#### Reverse Proxy Setup
1. **Install IIS and Application Request Routing**
2. **Configure URL Rewrite rules**:
   ```xml
   <rule name="ReverseProxyInboundRule1" stopProcessing="true">
     <match url="^api/(.*)" />
     <action type="Rewrite" url="http://localhost:5000/api/{R:1}" />
   </rule>
   <rule name="ReverseProxyInboundRule2" stopProcessing="true">
     <match url="^admin/(.*)" />
     <action type="Rewrite" url="http://localhost:3001/{R:1}" />
   </rule>
   <rule name="ReverseProxyInboundRule3" stopProcessing="true">
     <match url="(.*)" />
     <action type="Rewrite" url="http://localhost:3000/{R:1}" />
   </rule>
   ```

#### Service Setup
```powershell
# Install Docker as Windows Service
# Use docker-compose to manage services
# Set up Windows Task Scheduler for auto-start
```

## 📞 Support and Resources

### Windows-Specific Resources
- [Docker Desktop for Windows Documentation](https://docs.docker.com/desktop/windows/)
- [WSL 2 Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Windows Container Documentation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/)

### Common Commands Reference
```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart everything
docker-compose restart

# Clean up
docker-compose down -v
docker system prune -a
```

### Getting Help
1. **Check logs first**: `docker-compose logs -f`
2. **Check Docker Desktop status**: Look for whale icon in system tray
3. **Restart Docker Desktop**: Right-click whale → Restart
4. **Check Windows Event Viewer**: For system-level issues

---

## 🎉 Success!

Your Arabic Polymer Clay Store is now running on Windows with Docker! 

**Next Steps**:
1. **Access the admin dashboard**: http://localhost:3001
2. **Change default password**: admin/admin123
3. **Add your products and content**
4. **Customize WhatsApp number and social media links**
5. **Set up regular backups**

**Happy selling on Windows! 🪟🚀**