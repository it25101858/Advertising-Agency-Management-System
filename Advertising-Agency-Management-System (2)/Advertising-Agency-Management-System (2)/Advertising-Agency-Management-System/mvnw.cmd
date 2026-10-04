@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@REM Resolve Java
if not "%JAVA_HOME%" == "" (
    set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
) else (
    set "JAVA_EXE=java.exe"
)

echo [INFO] Running Maven Wrapper for AdFlow Application...
call mvn %*
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Direct Maven call attempted. If Maven is not installed on PATH, run via IntelliJ IDEA or configure Maven Home.
)
exit /b %ERRORLEVEL%
