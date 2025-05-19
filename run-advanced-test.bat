@echo off
echo ===== YouTube Smart Chapters AI Advanced Extension Tester =====
echo This script will run the advanced test with detailed screenshots
echo.

rem Run the regular test script with "advanced" parameter
call run-extension-test.bat advanced

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Advanced test failed. Please see error message above.
    echo.
    pause
    exit /b 1
)

echo.
echo Advanced testing completed successfully!
echo Screenshots saved in the test-results directory.
echo.

pause
