@echo off
setlocal EnableDelayedExpansion
title Arabic Clay Store - System Pre-flight Check

:: Set colors for output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

echo.
echo %BLUE%🔍 Arabic Clay Store - System Pre-flight Check%RESET%
echo %BLUE%================================================%RESET%
echo.
echo %YELLOW%This tool will verify your system is ready for Docker deployment.%RESET%
echo.

:: Initialize check results
set "CHECKS_PASSED=0"
set "CHECKS_FAILED=0"
set "TOTAL_CHECKS=8"

:: Function to report check result
:ReportCheck
if "%2"=="PASS" (
    echo %GREEN%✅ %1%RESET%
    set /a "CHECKS_PASSED+=1"
) else (
    echo %RED%❌ %1%RESET%
    set /a "CHECKS_FAILED+=1"
    if not "%3"=="" echo %YELLOW%   💡 %3%RESET%
)
goto :eof

:: ==================== SYSTEM CHECKS ====================

echo %BLUE%🖥️  System Requirements Check%RESET%
echo.

:: Check 1: Windows Version
echo %YELLOW%Checking Windows version...%RESET%
for /f "tokens=2 delims==" %%i in ('wmic os get version /value ^| find "="') do set "WINVER=%%i"
for /f "tokens=1,2 delims=." %%a in ("!WINVER!") do (
    set "MAJOR=%%a"
    set "MINOR=%%b"
)
if !MAJOR! GEQ 10 (
    call :ReportCheck "Windows version !WINVER! (Supported)" "PASS"
) else (
    call :ReportCheck "Windows version !WINVER! (Too old)" "FAIL" "Windows 10 (1903+) or Windows 11 required"
)

:: Check 2: System Architecture
echo %YELLOW%Checking system architecture...%RESET%
for /f "tokens=2 delims==" %%i in ('wmic os get osarchitecture /value ^| find "="') do set "ARCH=%%i"
if "!ARCH!"=="64-bit" (
    call :ReportCheck "System architecture: !ARCH!" "PASS"
) else (
    call :ReportCheck "System architecture: !ARCH! (Unsupported)" "FAIL" "64-bit Windows required for Docker Desktop"
)

:: Check 3: Available RAM
echo %YELLOW%Checking system memory...%RESET%
for /f "tokens=2 delims==" %%i in ('wmic computersystem get TotalPhysicalMemory /value ^| find "="') do (
    set /a "RAM_GB=%%i/1024/1024/1024"
)
if !RAM_GB! GEQ 8 (
    call :ReportCheck "System RAM: !RAM_GB! GB (Sufficient)" "PASS"
) else (
    call :ReportCheck "System RAM: !RAM_GB! GB (Insufficient)" "FAIL" "Minimum 8GB RAM required for stable operation"
)

:: Check 4: Free Disk Space
echo %YELLOW%Checking free disk space...%RESET%
for /f "tokens=3" %%i in ('dir C:\ ^| find "bytes free"') do (
    set "FREE_SPACE=%%i"
    set /a "FREE_GB=!FREE_SPACE:,=!/1024/1024/1024"
)
if !FREE_GB! GEQ 20 (
    call :ReportCheck "Free disk space: !FREE_GB! GB (Sufficient)" "PASS"
) else (
    call :ReportCheck "Free disk space: !FREE_GB! GB (Insufficient)" "FAIL" "Minimum 20GB free space required"
)

:: Check 5: Hyper-V Support
echo %YELLOW%Checking Hyper-V support...%RESET%
systeminfo | find "Hyper-V Requirements" >nul 2>&1
if errorlevel 1 (
    :: Alternative check for Hyper-V
    dism /online /get-featureinfo /featurename:Microsoft-Hyper-V-All >nul 2>&1
    if errorlevel 1 (
        call :ReportCheck "Hyper-V support (Unknown)" "FAIL" "Enable Hyper-V in Windows Features"
    ) else (
        call :ReportCheck "Hyper-V support (Available)" "PASS"
    )
) else (
    for /f "tokens=*" %%i in ('systeminfo ^| find "Hyper-V Requirements"') do (
        echo %%i | find "Yes" >nul
        if not errorlevel 1 (
            call :ReportCheck "Hyper-V support (Available)" "PASS"
        ) else (
            call :ReportCheck "Hyper-V support (Not available)" "FAIL" "Hardware virtualization required"
        )
    )
)

echo.
echo %BLUE%🐳 Docker Environment Check%RESET%
echo.

:: Check 6: Docker Installation
echo %YELLOW%Checking Docker installation...%RESET%
docker --version >nul 2>&1
if errorlevel 1 (
    call :ReportCheck "Docker installation (Not found)" "FAIL" "Install Docker Desktop from https://docker.com"
) else (
    for /f "tokens=3" %%i in ('docker --version') do (
        call :ReportCheck "Docker installation (%%i)" "PASS"
    )
)

:: Check 7: Docker Service Status
echo %YELLOW%Checking Docker service status...%RESET%
docker info >nul 2>&1
if errorlevel 1 (
    call :ReportCheck "Docker service (Not running)" "FAIL" "Start Docker Desktop application"
) else (
    call :ReportCheck "Docker service (Running)" "PASS"
)

:: Check 8: Docker Compose
echo %YELLOW%Checking Docker Compose...%RESET%
docker-compose --version >nul 2>&1
if errorlevel 1 (
    call :ReportCheck "Docker Compose (Not found)" "FAIL" "Usually included with Docker Desktop"
) else (
    for /f "tokens=3" %%i in ('docker-compose --version') do (
        call :ReportCheck "Docker Compose (%%i)" "PASS"
    )
)

echo.

:: ==================== NETWORK CONNECTIVITY ====================

echo %BLUE%🌐 Network Connectivity Check%RESET%
echo.

:: Check Docker Hub connectivity
echo %YELLOW%Testing Docker Hub connectivity...%RESET%
ping -n 1 registry-1.docker.io >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Cannot reach Docker Hub%RESET%
    echo %YELLOW%   💡 Check internet connection and firewall settings%RESET%
) else (
    echo %GREEN%✅ Docker Hub accessible%RESET%
)

:: Check required ports
echo %YELLOW%Checking port availability...%RESET%
set "REQUIRED_PORTS=3000 3001 5000 27017"
set "PORTS_OK=true"

for %%p in (%REQUIRED_PORTS%) do (
    netstat -an | find ":%%p " | find "LISTENING" >nul 2>&1
    if not errorlevel 1 (
        echo %RED%❌ Port %%p is already in use%RESET%
        set "PORTS_OK=false"
    ) else (
        echo %GREEN%✅ Port %%p is available%RESET%
    )
)

echo.

:: ==================== PROJECT VALIDATION ====================

echo %BLUE%📁 Project Structure Check%RESET%
echo.

:: Check if we're in the project directory
if not exist "docker-compose.yml" (
    echo %RED%❌ Not in project directory%RESET%
    echo %YELLOW%   💡 Navigate to arabic-clay-store folder and run this script%RESET%
    set "PROJECT_OK=false"
) else (
    echo %GREEN%✅ Found docker-compose.yml%RESET%
    set "PROJECT_OK=true"
)

:: Check project structure
if "%PROJECT_OK%"=="true" (
    set "PROJECT_FILES=server\package.json client\package.json admin-dashboard\package.json server\Dockerfile client\Dockerfile admin-dashboard\Dockerfile"
    
    for %%f in (%PROJECT_FILES%) do (
        if exist "%%f" (
            echo %GREEN%✅ %%f%RESET%
        ) else (
            echo %RED%❌ Missing %%f%RESET%
            set "PROJECT_OK=false"
        )
    )
)

echo.

:: ==================== SECURITY CHECK ====================

echo %BLUE%🛡️  Security Check%RESET%
echo.

:: Check if running as administrator
net session >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️  Not running as administrator%RESET%
    echo %YELLOW%   💡 Some Docker operations may require admin rights%RESET%
) else (
    echo %GREEN%✅ Running with administrator privileges%RESET%
)

:: Check Windows Defender status
sc query windefend | find "RUNNING" >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️  Windows Defender not running%RESET%
) else (
    echo %GREEN%✅ Windows Defender active%RESET%
    echo %YELLOW%   💡 Consider adding Docker exclusion for better performance%RESET%
)

echo.

:: ==================== RESULTS SUMMARY ====================

echo %BLUE%📊 Pre-flight Check Results%RESET%
echo %BLUE%==============================%RESET%
echo.

set /a "SUCCESS_RATE=(!CHECKS_PASSED! * 100) / !TOTAL_CHECKS!"

echo %YELLOW%Total Checks:%RESET%        !TOTAL_CHECKS!
echo %GREEN%Passed:%RESET%             !CHECKS_PASSED!
echo %RED%Failed:%RESET%             !CHECKS_FAILED!
echo %BLUE%Success Rate:%RESET%       !SUCCESS_RATE!%%
echo.

if !CHECKS_FAILED! EQU 0 (
    echo %GREEN%🎉 All checks passed! Your system is ready for deployment.%RESET%
    echo.
    echo %BLUE%Next steps:%RESET%
    echo   1. Run DEPLOY-WINDOWS-ENHANCED.bat
    echo   2. Choose your deployment type
    echo   3. Wait for deployment to complete
    echo   4. Access your store at http://localhost:3000
    echo.
    set /p "deploy=Start deployment now? (y/n): "
    if /i "!deploy!"=="y" (
        echo %YELLOW%Starting enhanced deployment script...%RESET%
        call DEPLOY-WINDOWS-ENHANCED.bat
    )
) else if !CHECKS_FAILED! LEQ 2 (
    echo %YELLOW%⚠️  Minor issues detected. Deployment may still work.%RESET%
    echo.
    echo %BLUE%Recommendations:%RESET%
    echo   • Fix the failed checks if possible
    echo   • Proceed with caution
    echo   • Monitor deployment closely
    echo.
    set /p "deploy=Attempt deployment anyway? (y/n): "
    if /i "!deploy!"=="y" (
        echo %YELLOW%Starting enhanced deployment script...%RESET%
        call DEPLOY-WINDOWS-ENHANCED.bat
    )
) else (
    echo %RED%❌ Multiple critical issues detected.%RESET%
    echo.
    echo %BLUE%Required actions:%RESET%
    echo   • Fix all failed checks before deployment
    echo   • Ensure Docker Desktop is properly installed
    echo   • Verify system meets minimum requirements
    echo   • Run this check again after fixes
    echo.
    echo %YELLOW%For help, see COMPLETE-WINDOWS-DEPLOYMENT.md%RESET%
)

echo.
echo %BLUE%Press any key to exit...%RESET%
pause >nul
exit /b 0