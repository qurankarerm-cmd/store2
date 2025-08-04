@echo off
setlocal enabledelayedexpansion

:: Docker Setup Script for Arabic Clay Store (Windows)
:: This script helps you get started with Docker quickly on Windows

title Arabic Clay Store - Docker Setup

echo.
echo 🌟 مرحباً بك في إعداد Docker لمتجر أعمالي بالطين! 🌟
echo Arabic Polymer Clay Store - Docker Setup (Windows)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

:: Check if Docker is installed
echo 🔄 Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo ℹ️  Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop first.
    echo ℹ️  Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed!

:: Check if Docker daemon is running
echo 🔄 Checking Docker daemon...
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker daemon is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker daemon is running!

:menu
echo.
echo ℹ️  Choose an option:
echo 1) 🚀 Production Setup (Build and run all services)
echo 2) 🔧 Development Setup (With hot reload)
echo 3) 🧹 Clean Up (Remove all containers and volumes)
echo 4) 📊 View Logs
echo 5) 🔍 Check Status
echo 6) 🛑 Stop All Services
echo 7) ❌ Exit
echo.

set /p choice="Enter your choice [1-7]: "

if "%choice%"=="1" goto production
if "%choice%"=="2" goto development
if "%choice%"=="3" goto cleanup
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto status
if "%choice%"=="6" goto stop
if "%choice%"=="7" goto exit
echo ❌ Invalid option! Please choose 1-7.
goto menu

:production
echo.
echo 🔄 Setting up production environment...
echo 🔄 Building and starting services...
docker-compose up --build -d
if errorlevel 1 (
    echo ❌ Failed to start services. Check Docker Desktop and try again.
    goto continue
)

echo 🔄 Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo ✅ Production environment is ready!
echo.
echo ℹ️  Services are available at:
echo 🌐 Public Website: http://localhost:3000
echo 🔧 Admin Dashboard: http://localhost:3001
echo 🔌 API Server: http://localhost:5000
echo 🗄️  MongoDB: localhost:27017
echo.
echo ℹ️  Default admin credentials:
echo Username: admin
echo Password: admin123
echo ⚠️  Please change the default password after first login!
goto continue

:development
echo.
echo 🔄 Setting up development environment...
echo 🔄 Building and starting development services...
docker-compose -f docker-compose.dev.yml up --build -d
if errorlevel 1 (
    echo ❌ Failed to start development services. Check Docker Desktop and try again.
    goto continue
)

echo 🔄 Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo ✅ Development environment is ready!
echo.
echo ℹ️  Services are available at:
echo 🌐 Public Website: http://localhost:3000 (with hot reload)
echo 🔧 Admin Dashboard: http://localhost:3001 (with hot reload)
echo 🔌 API Server: http://localhost:5000 (with hot reload)
echo 🗄️  MongoDB: localhost:27017
echo.
echo ℹ️  Development features:
echo • Hot reload for all services
echo • Source code mounted as volumes
echo • Development dependencies included
goto continue

:cleanup
echo.
echo ⚠️  This will remove all containers, networks, and volumes!
set /p confirm="Are you sure? (y/N): "
if /i not "%confirm%"=="y" (
    echo ℹ️  Cleanup cancelled.
    goto continue
)

echo 🔄 Cleaning up...
docker-compose down -v --remove-orphans 2>nul
docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>nul

:: Remove images
for /f "delims=" %%i in ('docker images -q "arabic-clay*" 2^>nul') do docker rmi %%i 2>nul

:: Remove volumes
docker volume rm arabic_clay_mongodb_data 2>nul
docker volume rm arabic_clay_uploads_data 2>nul
docker volume rm arabic_clay_mongodb_dev_data 2>nul
docker volume rm arabic_clay_uploads_dev_data 2>nul

:: Remove networks
docker network rm arabic-clay-network 2>nul
docker network rm arabic-clay-dev-network 2>nul

echo ✅ Cleanup completed!
goto continue

:logs
echo.
echo ℹ️  Choose logs to view:
echo 1) All services
echo 2) MongoDB
echo 3) Server (API)
echo 4) Client (Public Website)
echo 5) Admin Dashboard
echo 6) Back to main menu
echo.

set /p log_choice="Enter your choice [1-6]: "

if "%log_choice%"=="1" docker-compose logs -f
if "%log_choice%"=="2" docker-compose logs -f mongodb
if "%log_choice%"=="3" docker-compose logs -f server
if "%log_choice%"=="4" docker-compose logs -f client
if "%log_choice%"=="5" docker-compose logs -f admin
if "%log_choice%"=="6" goto continue
if not "%log_choice%"=="6" (
    echo Press Ctrl+C to stop viewing logs
    goto continue
)
goto continue

:status
echo.
echo 🔄 Checking service status...
echo.
echo 📊 Production Services:
docker-compose ps 2>nul
if errorlevel 1 echo No production services running

echo.
echo 🔧 Development Services:
docker-compose -f docker-compose.dev.yml ps 2>nul
if errorlevel 1 echo No development services running

echo.
echo 💾 Docker Volumes:
docker volume ls | findstr arabic_clay
if errorlevel 1 echo No volumes found

echo.
echo 🌐 Docker Networks:
docker network ls | findstr arabic-clay
if errorlevel 1 echo No networks found
goto continue

:stop
echo.
echo 🔄 Stopping all services...
docker-compose down 2>nul
docker-compose -f docker-compose.dev.yml down 2>nul
echo ✅ All services stopped!
goto continue

:continue
echo.
pause
goto menu

:exit
echo.
echo ℹ️  Goodbye! 👋
pause
exit /b 0