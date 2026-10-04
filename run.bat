@echo off
echo ================================================================
echo   BrightWave AdFlow - Advertising Agency Management System
echo ================================================================
echo.
java -version
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed or not found in system PATH.
    echo Please install JDK 17 or higher.
    pause
    exit /b 1
)

echo.
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Maven detected in PATH. Starting Spring Boot...
    mvn spring-boot:run
) else (
    echo ================================================================
    echo [QUICK START INSTRUCTIONS]
    echo 1. Open this folder in IntelliJ IDEA, Eclipse, or VS Code.
    echo 2. The IDE will automatically recognize pom.xml and import dependencies.
    echo 3. Open src\main\java\com\adflow\AdFlowApplication.java and click Run.
    echo 4. Access the web portal at: http://localhost:8080/
    echo ================================================================
)
pause
