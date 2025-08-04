# 🚀 Complete Windows Deployment Guide - أعمالي بالطين

**The Ultimate Step-by-Step Guide to Deploy Your Arabic Clay Store on Windows**

This comprehensive guide will take you from zero to a fully running Arabic polymer clay store with zero technical knowledge required. Every step is verified and tested on Windows 10/11.

---

## 📋 Table of Contents
1. [System Requirements & Pre-checks](#system-requirements--pre-checks)
2. [Docker Installation](#docker-installation)
3. [Project Preparation](#project-preparation)
4. [Deployment Options](#deployment-options)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Verification & Testing](#verification--testing)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Troubleshooting & Recovery](#troubleshooting--recovery)
9. [Maintenance & Updates](#maintenance--updates)
10. [Security Hardening](#security-hardening)

---

## 🔍 System Requirements & Pre-checks

### Minimum System Requirements
- **Operating System**: Windows 10 (64-bit) version 1903+ or Windows 11
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 20GB free space minimum
- **Processor**: 4-core CPU (Intel i5 or AMD Ryzen 5 equivalent)
- **Internet**: Stable internet connection for Docker image downloads

### ✅ Pre-Flight System Check

**Step 1: Check Windows Version**
```powershell
# Open PowerShell as Administrator and run:
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, WindowsBuildLabEx
```
✅ **Expected**: Windows 10 version 1903+ or Windows 11

**Step 2: Check Available RAM**
```powershell
Get-WmiObject -Class Win32_ComputerSystem | Select-Object TotalPhysicalMemory
```
✅ **Expected**: At least 8GB (8,589,934,592 bytes)

**Step 3: Check Free Disk Space**
```powershell
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace
```
✅ **Expected**: At least 20GB free on C: drive

**Step 4: Check Hyper-V Support**
```powershell
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
```
✅ **Expected**: State should be "Enabled" or "Disabled" (not "Disabled with Payload Removed")

---

## 🐳 Docker Installation

### Method 1: Automatic Installation (Recommended)

**Step 1: Download Docker Desktop**
1. Open your web browser
2. Go to: https://docs.docker.com/desktop/install/windows-installer/
3. Click **"Docker Desktop for Windows"**
4. Download `Docker Desktop Installer.exe`

**Step 2: Install Docker Desktop**
1. **Right-click** the installer → **"Run as administrator"**
2. **Check these options** during installation:
   - ✅ Enable Hyper-V Windows Features
   - ✅ Install required Windows components for WSL 2
3. Click **"Install"**
4. Wait for installation to complete (5-10 minutes)
5. **Restart your computer** when prompted

**Step 3: Initial Docker Setup**
1. **Start Docker Desktop** from Start Menu
2. **Accept the license agreement**
3. **Sign in** to Docker Hub (optional but recommended)
4. **Complete the tutorial** (optional)
5. **Wait for Docker to start** (green whale icon in system tray)

### Method 2: Command Line Installation

**Using Winget (Windows Package Manager)**
```powershell
# Run PowerShell as Administrator
winget install Docker.DockerDesktop
```

**Using Chocolatey**
```powershell
# Install Chocolatey first if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Docker Desktop
choco install docker-desktop
```

### 🔧 Docker Configuration

**Step 1: Configure Resources**
1. **Right-click Docker icon** in system tray
2. Click **"Settings"**
3. Go to **"Resources" → "Advanced"**
4. Configure:
   - **Memory**: 6GB minimum (8GB recommended)
   - **CPUs**: 4 cores minimum
   - **Disk Image Size**: 60GB minimum
5. Click **"Apply & Restart"**

**Step 2: Enable WSL 2 (Recommended)**
1. In Docker Settings, go to **"General"**
2. Ensure **"Use WSL 2 based engine"** is checked
3. Go to **"Resources" → "WSL Integration"**
4. Enable integration with your WSL distributions
5. Click **"Apply & Restart"**

### ✅ Verify Docker Installation

**Open PowerShell and run:**
```powershell
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Test Docker is running
docker run hello-world
```

**Expected Output:**
```
Docker version 24.0.x, build xxxxxxx
Docker Compose version v2.x.x
Hello from Docker!
```

❌ **If you see errors**, go to [Troubleshooting Section](#troubleshooting--recovery)

---

## 📁 Project Preparation

### Step 1: Navigate to Project Directory
```powershell
# Open PowerShell in project directory
cd "C:\Users\Admin\Desktop\New folder\arabic-clay-store"

# Verify you're in the right location
dir
```

**Expected Output:** You should see folders: `client`, `server`, `admin-dashboard`, and files like `docker-compose.yml`

### Step 2: Verify Project Files
```powershell
# Check all required files exist
$requiredFiles = @(
    "docker-compose.yml",
    "docker-compose.dev.yml", 
    "server\Dockerfile",
    "client\Dockerfile",
    "admin-dashboard\Dockerfile",
    "server\Dockerfile.dev",
    "client\Dockerfile.dev",
    "admin-dashboard\Dockerfile.dev"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
    }
}
```

✅ **All files should exist**. If any are missing, check the project setup.

---

## 🎯 Deployment Options

### Option A: Production Deployment (Recommended for Live Use)
- **Purpose**: For running the store for actual customers
- **Features**: Optimized for performance, smaller Docker images
- **Best for**: Final deployment, testing with real data

### Option B: Development Deployment (For Coding/Testing)
- **Purpose**: For making changes to the code
- **Features**: Hot reload, development tools, larger images
- **Best for**: Customizing the store, adding features

---

## 🚀 Step-by-Step Deployment

### Option A: Production Deployment

**Step 1: Pre-Deployment Check**
```powershell
# Ensure Docker is running
docker info
```
✅ **Expected**: Should show Docker system information without errors

**Step 2: Clean Previous Installations (if any)**
```powershell
# Stop and remove any existing containers
docker-compose down -v --remove-orphans
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# Clean Docker system
docker system prune -f
```

**Step 3: Start Production Deployment**
```powershell
# Build and start all services
docker-compose up --build -d
```

**What happens during this step:**
- Downloads MongoDB, Node.js images (~2GB)
- Builds your Arabic Clay Store application
- Starts 4 services: Database, API Server, Public Website, Admin Dashboard
- **Time**: 5-15 minutes depending on internet speed

**Step 4: Monitor Deployment Progress**
```powershell
# Watch logs in real-time
docker-compose logs -f
```

**What to look for:**
- ✅ `arabic_clay_mongodb` shows: `"Waiting for connections"`
- ✅ `arabic_clay_server` shows: `"Server running on port 5000"`
- ✅ `arabic_clay_client` shows: `"Ready - started server on 0.0.0.0:3000"`
- ✅ `arabic_clay_admin` shows: `"Ready - started server on 0.0.0.0:3001"`

**Press Ctrl+C to exit log viewing**

### Option B: Development Deployment

**Step 1-2: Same as Production**

**Step 3: Start Development Deployment**
```powershell
# Build and start development services with hot reload
docker-compose -f docker-compose.dev.yml up --build -d
```

**Step 4: Monitor Development Progress**
```powershell
# Watch development logs
docker-compose -f docker-compose.dev.yml logs -f
```

---

## ✅ Verification & Testing

### Step 1: Check Service Status
```powershell
# Check all containers are running
docker-compose ps
```

**Expected Output:**
```
Name                        State    Ports
arabic_clay_mongodb         Up       0.0.0.0:27017->27017/tcp
arabic_clay_server          Up       0.0.0.0:5000->5000/tcp  
arabic_clay_client          Up       0.0.0.0:3000->3000/tcp  
arabic_clay_admin           Up       0.0.0.0:3001->3001/tcp  
```

✅ **All services should show "Up"**

### Step 2: Test Service Health
```powershell
# Test API server
curl http://localhost:5000/api/health

# Test if services respond
$services = @(
    @{Name="API Server"; URL="http://localhost:5000/api/health"},
    @{Name="Public Website"; URL="http://localhost:3000"},
    @{Name="Admin Dashboard"; URL="http://localhost:3001"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.URL -UseBasicParsing -TimeoutSec 10
        Write-Host "✅ $($service.Name) is responding (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "❌ $($service.Name) is not responding" -ForegroundColor Red
    }
}
```

### Step 3: Browser Testing

**Open your web browser and test each URL:**

1. **Public Website**: http://localhost:3000
   - ✅ Should show Arabic text and RTL layout
   - ✅ Should display "أعمالي بالطين" branding
   - ✅ Should have a floating WhatsApp button

2. **Admin Dashboard**: http://localhost:3001
   - ✅ Should show login form in Arabic
   - ✅ Default credentials: admin / admin123
   - ✅ Should redirect to dashboard after login

3. **API Health**: http://localhost:5000/api/health
   - ✅ Should show: `{"status":"OK","database":"connected"}`

### Step 4: Database Verification
```powershell
# Connect to MongoDB and verify setup
docker exec -it arabic_clay_mongodb mongosh -u admin -p admin123

# Inside MongoDB shell, run:
show dbs
use arabic-clay-store
show collections
db.products.countDocuments()
exit
```

✅ **Expected**: Should show `arabic-clay-store` database with collections

---

## ⚙️ Post-Deployment Configuration

### Step 1: Change Default Passwords (CRITICAL)

**1. Change MongoDB Password**
```powershell
# Generate a strong password
$newMongoPassword = [System.Web.Security.Membership]::GeneratePassword(16, 4)
Write-Host "New MongoDB Password: $newMongoPassword"

# Update docker-compose.yml with new password
# Open in text editor and replace 'admin123' with your new password
```

**2. Change JWT Secret**
```powershell
# Generate a strong JWT secret
$newJWTSecret = [System.Web.Security.Membership]::GeneratePassword(32, 8)
Write-Host "New JWT Secret: $newJWTSecret"

# Update docker-compose.yml with new JWT secret
```

**3. Change Admin Password**
1. Go to http://localhost:3001
2. Login with: admin / admin123
3. Navigate to **Profile/Settings**
4. Change password to a strong password
5. **Write down your new password safely**

### Step 2: Configure Business Information

**Edit these files to customize your store:**

1. **WhatsApp Number**: Update in `docker-compose.yml`
   ```yaml
   WHATSAPP_NUMBER: YOUR_WHATSAPP_NUMBER
   ```

2. **Social Media**: Update in `docker-compose.yml`
   ```yaml
   FACEBOOK_PAGE: your-page-name
   INSTAGRAM_USERNAME: your-instagram
   TIKTOK_USERNAME: your-tiktok
   ```

**After making changes:**
```powershell
# Restart services to apply changes
docker-compose restart
```

### Step 3: Add Your First Product

1. Go to **Admin Dashboard**: http://localhost:3001
2. Login with your credentials
3. Navigate to **"المنتجات" (Products)**
4. Click **"إضافة منتج جديد" (Add New Product)**
5. Fill in:
   - **Name**: اسم المنتج
   - **Description**: وصف المنتج
   - **Price**: السعر (e.g., "ابتداءً من 75 جنيه")
   - **Category**: Choose from dropdown
   - **Images**: Upload product photos
6. Click **"حفظ" (Save)**

### Step 4: Test Customer Flow

1. Go to **Public Website**: http://localhost:3000
2. Browse products
3. Click **"اطلب عبر واتساب" (Order via WhatsApp)**
4. Verify WhatsApp opens with pre-filled message

---

## 🚨 Troubleshooting & Recovery

### Common Issue 1: "Docker daemon is not running"

**Symptoms**: `docker: command not found` or `cannot connect to daemon`

**Solution**:
```powershell
# 1. Check if Docker Desktop is running
Get-Process "Docker Desktop" -ErrorAction SilentlyContinue

# 2. If not running, start Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# 3. Wait 2-3 minutes for Docker to fully start
# Look for green whale icon in system tray

# 4. Test again
docker --version
```

### Common Issue 2: "Port already in use"

**Symptoms**: `Error: bind: address already in use`

**Solution**:
```powershell
# Find what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5000

# Kill processes using these ports (replace PID with actual process ID)
taskkill /PID 1234 /F

# Or use different ports in docker-compose.yml
```

### Common Issue 3: "No space left on device"

**Symptoms**: Build fails with disk space error

**Solution**:
```powershell
# Clean Docker system
docker system prune -a -f
docker volume prune -f

# Check disk space
docker system df

# If still issues, increase Docker Desktop disk allocation
```

### Common Issue 4: Services fail to start

**Diagnosis**:
```powershell
# Check specific service logs
docker logs arabic_clay_server
docker logs arabic_clay_client
docker logs arabic_clay_admin
docker logs arabic_clay_mongodb

# Check service status
docker-compose ps
```

**Common Solutions**:
1. **MongoDB not ready**: Wait 30 seconds and restart
   ```powershell
   docker-compose restart server client admin
   ```

2. **Build errors**: Rebuild without cache
   ```powershell
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Network issues**: Reset Docker networks
   ```powershell
   docker network prune -f
   docker-compose down
   docker-compose up -d
   ```

### Complete Recovery Procedure

**If everything is broken, start fresh:**
```powershell
# 1. Stop everything
docker-compose down -v --remove-orphans
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# 2. Clean everything
docker system prune -a -f
docker volume prune -f
docker network prune -f

# 3. Restart Docker Desktop
# Right-click Docker icon → Restart Docker Desktop

# 4. Wait for Docker to fully start (5 minutes)

# 5. Start fresh deployment
docker-compose up --build -d
```

---

## 🔄 Maintenance & Updates

### Daily Maintenance

**Check service health:**
```powershell
# Quick health check
docker-compose ps
curl http://localhost:5000/api/health
```

### Weekly Maintenance

**Clean up Docker:**
```powershell
# Remove unused containers and images
docker system prune -f

# Check disk usage
docker system df
```

### Monthly Maintenance

**Backup database:**
```powershell
# Create backup
docker exec arabic_clay_mongodb mongodump --archive=backup-$(Get-Date -Format 'yyyy-MM-dd').archive

# Copy backup to safe location
docker cp arabic_clay_mongodb:/backup-$(Get-Date -Format 'yyyy-MM-dd').archive ./backups/
```

**Update Docker images:**
```powershell
# Pull latest base images
docker-compose pull

# Rebuild and restart
docker-compose up --build -d
```

### Backup Strategy

**What to backup:**
1. **Database**: MongoDB data
2. **Uploads**: Product images
3. **Configuration**: docker-compose.yml with your settings

**Backup script:**
```powershell
# Create backup directory
New-Item -ItemType Directory -Force -Path ".\backups\$(Get-Date -Format 'yyyy-MM-dd')"

# Backup database
docker exec arabic_clay_mongodb mongodump --archive=backup.archive
docker cp arabic_clay_mongodb:/backup.archive ".\backups\$(Get-Date -Format 'yyyy-MM-dd')\database.archive"

# Backup uploads
docker cp arabic_clay_server:/app/uploads ".\backups\$(Get-Date -Format 'yyyy-MM-dd')\uploads"

# Backup configuration
Copy-Item "docker-compose.yml" ".\backups\$(Get-Date -Format 'yyyy-MM-dd')\docker-compose.yml"
```

---

## 🛡️ Security Hardening

### Step 1: Change All Default Passwords

**Already covered in Post-Deployment Configuration**

### Step 2: Configure Windows Firewall

```powershell
# Allow Docker through Windows Firewall (if needed)
New-NetFirewallRule -DisplayName "Docker Desktop" -Direction Inbound -Program "C:\Program Files\Docker\Docker\Docker Desktop.exe" -Action Allow
```

### Step 3: Secure MongoDB

**Create production configuration:**
```powershell
# Create custom MongoDB configuration
@"
# MongoDB Production Configuration
security:
  authorization: enabled
net:
  bindIp: 127.0.0.1
  port: 27017
"@ | Out-File -FilePath ".\mongodb.conf"
```

### Step 4: Environment Variables

**Create secure environment file:**
```powershell
# Create .env file with production values
@"
MONGODB_ROOT_PASSWORD=YOUR_SECURE_PASSWORD_HERE
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE
WHATSAPP_NUMBER=YOUR_WHATSAPP_NUMBER
FACEBOOK_PAGE=your-facebook-page
INSTAGRAM_USERNAME=your-instagram
TIKTOK_USERNAME=your-tiktok
"@ | Out-File -FilePath ".env"

# Update docker-compose.yml to use .env file
```

### Step 5: Network Security

**In production deployment:**
1. **Remove MongoDB port exposure** (port 27017) from docker-compose.yml
2. **Use internal Docker networking only**
3. **Set up reverse proxy** (Nginx) if deploying to server

---

## 🎉 Deployment Complete!

**Congratulations! Your Arabic Clay Store is now running!**

### 🌟 What You Have Now:

1. **🌐 Public Website**: http://localhost:3000
   - Arabic RTL storefront
   - Product catalog
   - WhatsApp integration
   - Custom order forms

2. **⚡ Admin Dashboard**: http://localhost:3001
   - Product management
   - Review management
   - Order tracking
   - Analytics

3. **🔧 API Server**: http://localhost:5000
   - RESTful API
   - File uploads
   - Authentication

4. **📊 Database**: Secure MongoDB with your data

### 🚀 Next Steps:

1. **Add your products** through the admin dashboard
2. **Customize colors and branding** (edit CSS files)
3. **Set up your social media links**
4. **Test the customer ordering flow**
5. **Set up regular backups**

### 📞 Need Help?

- **Check logs**: `docker-compose logs -f`
- **Restart services**: `docker-compose restart`
- **Complete reset**: Follow the "Complete Recovery Procedure"

---

**Your Arabic Clay Store is ready for business! 🏪✨**

**May your handmade creations bring joy to many customers! 🎨**