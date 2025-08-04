@echo off
setlocal EnableDelayedExpansion
title Arabic Clay Store - Enhanced Windows Deployment

:: Set colors for output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

echo.
echo %BLUE%🌟 Enhanced Arabic Clay Store Deployment for Windows 🌟%RESET%
echo %BLUE%================================================================%RESET%
echo.

:: Initialize variables
set "DOCKER_INSTALLED=false"
set "DOCKER_RUNNING=false"
set "PROJECT_VALID=false"
set "DEPLOYMENT_TYPE="

:: Function to display status
:DisplayStatus
echo %GREEN%✅ Docker Status:%RESET%        !DOCKER_INSTALLED! / !DOCKER_RUNNING!
echo %GREEN%✅ Project Status:%RESET%       !PROJECT_VALID!
echo %GREEN%✅ Deployment Type:%RESET%      !DEPLOYMENT_TYPE!
echo.
goto :eof

:: ==================== SYSTEM CHECKS ====================
echo %YELLOW%🔍 Running Pre-flight System Checks...%RESET%
echo.

:: Check Windows version
echo %BLUE%Checking Windows version...%RESET%
for /f "tokens=2 delims==" %%i in ('wmic os get version /value ^| find "="') do set "WINVER=%%i"
echo   Windows Version: !WINVER!

:: Check available RAM
echo %BLUE%Checking system memory...%RESET%
for /f "tokens=2 delims==" %%i in ('wmic computersystem get TotalPhysicalMemory /value ^| find "="') do (
    set /a "RAM_GB=%%i/1024/1024/1024"
    echo   Total RAM: !RAM_GB! GB
    if !RAM_GB! LSS 8 (
        echo %RED%⚠️  WARNING: Less than 8GB RAM detected. Deployment may be slow.%RESET%
    )
)

:: Check free disk space
echo %BLUE%Checking free disk space...%RESET%
for /f "tokens=3" %%i in ('dir C:\ ^| find "bytes free"') do (
    set "FREE_SPACE=%%i"
    set /a "FREE_GB=!FREE_SPACE:,=!/1024/1024/1024"
    echo   Free Space: !FREE_GB! GB
    if !FREE_GB! LSS 20 (
        echo %RED%⚠️  WARNING: Less than 20GB free space. Cleanup recommended.%RESET%
    )
)

echo.

:: ==================== DOCKER CHECKS ====================
echo %YELLOW%🐳 Checking Docker Installation...%RESET%

:: Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ ERROR: Docker is not installed!%RESET%
    echo.
    echo %YELLOW%📥 Docker Installation Required:%RESET%
    echo   1. Visit: https://docs.docker.com/desktop/install/windows-installer/
    echo   2. Download Docker Desktop for Windows
    echo   3. Run installer as Administrator
    echo   4. Restart your computer
    echo   5. Start Docker Desktop
    echo   6. Run this script again
    echo.
    echo %BLUE%Alternative Installation Methods:%RESET%
    echo   • Winget: winget install Docker.DockerDesktop
    echo   • Chocolatey: choco install docker-desktop
    echo.
    pause
    exit /b 1
) else (
    set "DOCKER_INSTALLED=true"
    for /f "tokens=3" %%i in ('docker --version') do (
        echo %GREEN%✅ Docker installed: %%i%RESET%
    )
)

:: Check if Docker is running
echo %BLUE%Checking if Docker daemon is running...%RESET%
docker info >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ ERROR: Docker is not running!%RESET%
    echo.
    echo %YELLOW%🚀 Starting Docker Desktop...%RESET%
    echo Please wait while we try to start Docker Desktop...
    
    :: Try to start Docker Desktop
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    :: Wait for Docker to start (up to 3 minutes)
    set /a "COUNTER=0"
    :WaitForDocker
    timeout /t 10 /nobreak >nul
    docker info >nul 2>&1
    if not errorlevel 1 (
        echo %GREEN%✅ Docker is now running!%RESET%
        set "DOCKER_RUNNING=true"
        goto DockerReady
    )
    set /a "COUNTER+=1"
    if !COUNTER! LSS 18 (
        echo   Waiting for Docker to start... (!COUNTER!/18)
        goto WaitForDocker
    )
    
    echo %RED%❌ Docker failed to start automatically.%RESET%
    echo.
    echo %YELLOW%Manual Steps Required:%RESET%
    echo   1. Start Docker Desktop from Start Menu
    echo   2. Wait for Docker to fully start (green whale icon in system tray)
    echo   3. Run this script again
    echo.
    pause
    exit /b 1
) else (
    set "DOCKER_RUNNING=true"
    echo %GREEN%✅ Docker daemon is running%RESET%
)

:DockerReady

:: Get Docker system info
echo %BLUE%Getting Docker system information...%RESET%
for /f "tokens=*" %%i in ('docker system df --format "table {{.Type}}\t{{.Size}}"') do (
    echo   %%i
)

echo.

:: ==================== PROJECT VALIDATION ====================
echo %YELLOW%📁 Validating Project Structure...%RESET%

:: Check if we're in the right directory
if not exist "docker-compose.yml" (
    echo %RED%❌ ERROR: Not in project directory!%RESET%
    echo.
    echo Current directory: %CD%
    echo.
    echo %YELLOW%Expected directory structure:%RESET%
    echo   📁 arabic-clay-store/
    echo   ├── 📄 docker-compose.yml
    echo   ├── 📁 server/
    echo   ├── 📁 client/
    echo   └── 📁 admin-dashboard/
    echo.
    echo %BLUE%Navigate to the correct directory and run this script again.%RESET%
    pause
    exit /b 1
)

:: Check all required files
set "MISSING_FILES="
set "FILES_TO_CHECK=docker-compose.yml docker-compose.dev.yml server\Dockerfile client\Dockerfile admin-dashboard\Dockerfile server\package.json client\package.json admin-dashboard\package.json"

for %%f in (%FILES_TO_CHECK%) do (
    if exist "%%f" (
        echo %GREEN%✅ %%f%RESET%
    ) else (
        echo %RED%❌ %%f%RESET%
        set "MISSING_FILES=!MISSING_FILES! %%f"
    )
)

if not "!MISSING_FILES!"=="" (
    echo.
    echo %RED%❌ ERROR: Missing required files:!MISSING_FILES!%RESET%
    echo.
    echo %YELLOW%Please ensure you have the complete project files.%RESET%
    pause
    exit /b 1
)

set "PROJECT_VALID=true"
echo %GREEN%✅ All project files verified%RESET%
echo.

:: ==================== DEPLOYMENT OPTIONS ====================
call :DisplayStatus

echo %YELLOW%🚀 Choose Deployment Type:%RESET%
echo.
echo %GREEN%1)%RESET% 🏭 %BLUE%Production Deployment%RESET%
echo    • Optimized for performance
echo    • Smaller Docker images  
echo    • Best for live store
echo    • Recommended for most users
echo.
echo %GREEN%2)%RESET% 🔧 %BLUE%Development Deployment%RESET%
echo    • Hot reload enabled
echo    • Development tools included
echo    • Best for customization
echo    • Larger images, slower startup
echo.
echo %GREEN%3)%RESET% 🧹 %BLUE%Clean Up%RESET%
echo    • Stop all services
echo    • Remove containers and volumes
echo    • Clean Docker system
echo.
echo %GREEN%4)%RESET% 📊 %BLUE%View Status%RESET%
echo    • Check running services
echo    • View logs
echo    • Service health checks
echo.
echo %GREEN%5)%RESET% ❌ %BLUE%Exit%RESET%
echo.

set /p "choice=Enter your choice (1-5): "

if "%choice%"=="1" goto ProductionDeploy
if "%choice%"=="2" goto DevelopmentDeploy  
if "%choice%"=="3" goto CleanUp
if "%choice%"=="4" goto ViewStatus
if "%choice%"=="5" goto ExitScript

echo %RED%❌ Invalid choice! Please enter 1-5.%RESET%
pause
goto :eof

:: ==================== PRODUCTION DEPLOYMENT ====================
:ProductionDeploy
set "DEPLOYMENT_TYPE=Production"
echo.
echo %YELLOW%🏭 Starting Production Deployment...%RESET%
echo %BLUE%This will build and start all services in production mode.%RESET%
echo %BLUE%First-time setup may take 10-15 minutes.%RESET%
echo.

set /p "confirm=Continue with production deployment? (y/n): "
if /i not "%confirm%"=="y" goto :eof

echo %YELLOW%⏳ Building and starting services...%RESET%
echo.

:: Stop any existing services
echo %BLUE%Stopping existing services...%RESET%
docker-compose down -v --remove-orphans >nul 2>&1
docker-compose -f docker-compose.dev.yml down -v --remove-orphans >nul 2>&1

:: Start production deployment
echo %BLUE%Starting production build...%RESET%
docker-compose up --build -d

if errorlevel 1 (
    echo.
    echo %RED%❌ Production deployment failed!%RESET%
    echo.
    echo %YELLOW%Troubleshooting steps:%RESET%
    echo   1. Check Docker logs: docker-compose logs
    echo   2. Verify system resources (RAM/Disk)
    echo   3. Try cleanup: docker system prune -f
    echo   4. Restart Docker Desktop
    echo.
    pause
    exit /b 1
)

goto DeploymentSuccess

:: ==================== DEVELOPMENT DEPLOYMENT ====================
:DevelopmentDeploy
set "DEPLOYMENT_TYPE=Development"
echo.
echo %YELLOW%🔧 Starting Development Deployment...%RESET%
echo %BLUE%This will start services with hot reload enabled.%RESET%
echo %BLUE%Perfect for making code changes.%RESET%
echo.

set /p "confirm=Continue with development deployment? (y/n): "
if /i not "%confirm%"=="y" goto :eof

echo %YELLOW%⏳ Building and starting development services...%RESET%
echo.

:: Stop any existing services
echo %BLUE%Stopping existing services...%RESET%
docker-compose down -v --remove-orphans >nul 2>&1
docker-compose -f docker-compose.dev.yml down -v --remove-orphans >nul 2>&1

:: Start development deployment
echo %BLUE%Starting development build...%RESET%
docker-compose -f docker-compose.dev.yml up --build -d

if errorlevel 1 (
    echo.
    echo %RED%❌ Development deployment failed!%RESET%
    echo.
    echo %YELLOW%Troubleshooting steps:%RESET%
    echo   1. Check Docker logs: docker-compose -f docker-compose.dev.yml logs
    echo   2. Verify system resources (RAM/Disk)
    echo   3. Try cleanup: docker system prune -f
    echo   4. Restart Docker Desktop
    echo.
    pause
    exit /b 1
)

goto DeploymentSuccess

:: ==================== DEPLOYMENT SUCCESS ====================
:DeploymentSuccess
echo.
echo %GREEN%🎉 DEPLOYMENT SUCCESSFUL! 🎉%RESET%
echo %GREEN%===============================%RESET%
echo.

:: Wait for services to be ready
echo %YELLOW%⏳ Waiting for services to start...%RESET%
timeout /t 30 /nobreak >nul

:: Check service status
echo %BLUE%Checking service status...%RESET%
if "%DEPLOYMENT_TYPE%"=="Development" (
    docker-compose -f docker-compose.dev.yml ps
) else (
    docker-compose ps
)

echo.
echo %GREEN%🌐 Your Arabic Clay Store is now running!%RESET%
echo.
echo %BLUE%📱 Access your applications:%RESET%
echo   %GREEN%•%RESET% Public Website:    %YELLOW%http://localhost:3000%RESET%
echo   %GREEN%•%RESET% Admin Dashboard:   %YELLOW%http://localhost:3001%RESET%
echo   %GREEN%•%RESET% API Server:        %YELLOW%http://localhost:5000%RESET%
echo   %GREEN%•%RESET% Health Check:      %YELLOW%http://localhost:5000/api/health%RESET%
echo.
echo %BLUE%🔑 Default admin credentials:%RESET%
echo   %GREEN%•%RESET% Username: %YELLOW%admin%RESET%
echo   %GREEN%•%RESET% Password: %YELLOW%admin123%RESET%
echo   %RED%⚠️  IMPORTANT: Change password after first login!%RESET%
echo.

:: Test service connectivity
echo %BLUE%🔍 Testing service connectivity...%RESET%
set "SERVICES_OK=true"

:: Test API Health
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ API Server not responding%RESET%
    set "SERVICES_OK=false"
) else (
    echo %GREEN%✅ API Server responding%RESET%
)

:: Test Client
curl -s -I http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Public Website not responding%RESET%
    set "SERVICES_OK=false"
) else (
    echo %GREEN%✅ Public Website responding%RESET%
)

:: Test Admin
curl -s -I http://localhost:3001 >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Admin Dashboard not responding%RESET%
    set "SERVICES_OK=false"
) else (
    echo %GREEN%✅ Admin Dashboard responding%RESET%
)

if "%SERVICES_OK%"=="false" (
    echo.
    echo %YELLOW%⚠️  Some services may still be starting. Please wait 2-3 minutes.%RESET%
)

echo.
echo %BLUE%📊 Useful management commands:%RESET%
if "%DEPLOYMENT_TYPE%"=="Development" (
    echo   %GREEN%•%RESET% Check status:      %YELLOW%docker-compose -f docker-compose.dev.yml ps%RESET%
    echo   %GREEN%•%RESET% View logs:         %YELLOW%docker-compose -f docker-compose.dev.yml logs -f%RESET%
    echo   %GREEN%•%RESET% Stop services:     %YELLOW%docker-compose -f docker-compose.dev.yml down%RESET%
    echo   %GREEN%•%RESET% Restart services:  %YELLOW%docker-compose -f docker-compose.dev.yml restart%RESET%
) else (
    echo   %GREEN%•%RESET% Check status:      %YELLOW%docker-compose ps%RESET%
    echo   %GREEN%•%RESET% View logs:         %YELLOW%docker-compose logs -f%RESET%
    echo   %GREEN%•%RESET% Stop services:     %YELLOW%docker-compose down%RESET%
    echo   %GREEN%•%RESET% Restart services:  %YELLOW%docker-compose restart%RESET%
)
echo.
echo %BLUE%💡 Tips:%RESET%
echo   %GREEN%•%RESET% Keep Docker Desktop running for the store to work
echo   %GREEN%•%RESET% First product upload may take a moment to process
echo   %GREEN%•%RESET% Check logs if any issues: docker-compose logs -f
echo.

:: Ask if user wants to open the website
set /p "open=Open the websites in your browser? (y/n): "
if /i "%open%"=="y" (
    echo %BLUE%🌐 Opening websites...%RESET%
    start http://localhost:3000
    timeout /t 2 /nobreak >nul
    start http://localhost:3001
)

goto ContinueMenu

:: ==================== CLEANUP ====================
:CleanUp
echo.
echo %YELLOW%🧹 Docker Cleanup Options:%RESET%
echo.
echo %GREEN%1)%RESET% Stop services only (keep data)
echo %GREEN%2)%RESET% Stop and remove containers (keep data)  
echo %GREEN%3)%RESET% Complete cleanup (remove everything)
echo %GREEN%4)%RESET% Return to main menu
echo.

set /p "cleanup_choice=Choose cleanup option (1-4): "

if "%cleanup_choice%"=="1" (
    echo %BLUE%Stopping services...%RESET%
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo %GREEN%✅ Services stopped%RESET%
)

if "%cleanup_choice%"=="2" (
    echo %BLUE%Stopping and removing containers...%RESET%
    docker-compose down --remove-orphans
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    echo %GREEN%✅ Containers removed%RESET%
)

if "%cleanup_choice%"=="3" (
    echo %RED%⚠️  This will remove all data including uploaded images!%RESET%
    set /p "confirm_cleanup=Are you sure? Type 'YES' to confirm: "
    if "!confirm_cleanup!"=="YES" (
        echo %BLUE%Performing complete cleanup...%RESET%
        docker-compose down -v --remove-orphans
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        docker volume prune -f
        echo %GREEN%✅ Complete cleanup finished%RESET%
    ) else (
        echo %YELLOW%Cleanup cancelled%RESET%
    )
)

if "%cleanup_choice%"=="4" goto ContinueMenu

goto ContinueMenu

:: ==================== VIEW STATUS ====================
:ViewStatus
echo.
echo %YELLOW%📊 System Status:%RESET%
echo.

:: Check Docker status
docker info >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Docker not running%RESET%
) else (
    echo %GREEN%✅ Docker running%RESET%
)

:: Check services
echo.
echo %BLUE%🔍 Service Status:%RESET%
docker-compose ps 2>nul
if errorlevel 1 (
    echo %YELLOW%No production services running%RESET%
)

echo.
echo %BLUE%🔍 Development Service Status:%RESET%
docker-compose -f docker-compose.dev.yml ps 2>nul
if errorlevel 1 (
    echo %YELLOW%No development services running%RESET%
)

:: System resources
echo.
echo %BLUE%💾 Docker System Usage:%RESET%
docker system df

echo.
echo %BLUE%📈 Container Resource Usage:%RESET%
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

goto ContinueMenu

:: ==================== CONTINUE MENU ====================
:ContinueMenu
echo.
echo %BLUE%What would you like to do next?%RESET%
echo %GREEN%1)%RESET% Return to main menu
echo %GREEN%2)%RESET% View live logs
echo %GREEN%3)%RESET% Open websites
echo %GREEN%4)%RESET% Exit
echo.

set /p "next_choice=Choose option (1-4): "

if "%next_choice%"=="1" goto :eof
if "%next_choice%"=="2" (
    echo %BLUE%Showing live logs (Press Ctrl+C to stop):%RESET%
    if "%DEPLOYMENT_TYPE%"=="Development" (
        docker-compose -f docker-compose.dev.yml logs -f
    ) else (
        docker-compose logs -f
    )
    goto ContinueMenu
)
if "%next_choice%"=="3" (
    start http://localhost:3000
    start http://localhost:3001
    goto ContinueMenu
)
if "%next_choice%"=="4" goto ExitScript

goto ContinueMenu

:: ==================== EXIT ====================
:ExitScript
echo.
echo %GREEN%Thank you for using the Arabic Clay Store deployment script!%RESET%
echo %BLUE%Your store is ready to serve customers! 🏪✨%RESET%
echo.
echo %YELLOW%Quick reminder:%RESET%
echo   %GREEN%•%RESET% Public Website: http://localhost:3000
echo   %GREEN%•%RESET% Admin Dashboard: http://localhost:3001
echo   %GREEN%•%RESET% Keep Docker Desktop running
echo.
pause
exit /b 0