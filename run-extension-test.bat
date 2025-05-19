@echo off
echo ===== YouTube Smart Chapters AI Extension Tester =====
echo This script will test your Chrome extension using Puppeteer
echo.

echo Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Checking if puppeteer is installed...
node -e "try { require.resolve('puppeteer'); console.log('Puppeteer is installed'); } catch(e) { console.log('Puppeteer is NOT installed'); process.exit(1); }" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing puppeteer and other dependencies...
    echo This may take a minute or two...
    npm install puppeteer path fs
    if %ERRORLEVEL% NEQ 0 (
        echo Error: Failed to install dependencies.
        echo.
        pause
        exit /b 1
    )
    echo Dependencies installed successfully.
) else (
    echo Puppeteer is already installed.
)

echo.
echo Starting extension test...
echo A Chrome browser window will open with your extension loaded.
echo The test will navigate to a YouTube video to check extension functionality.
echo When finished, close the browser window or press Ctrl+C in this terminal.
echo.

rem Create test-results directory if using advanced test
if "%1"=="advanced" (
    if not exist test-results mkdir test-results
    echo Running advanced test with detailed screenshots...
    node advanced-test-extension.js
) else (
    node test-extension.js
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Test failed. Please see error message above.
    echo.
    pause
    exit /b 1
)

echo.
echo Test completed successfully!
echo A screenshot was saved as youtube-with-extension.png
if "%1"=="advanced" (
    echo Additional screenshots saved in the test-results directory.
)
echo.

pause
