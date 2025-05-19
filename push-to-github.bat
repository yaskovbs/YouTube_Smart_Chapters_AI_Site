@echo off
echo ===== YouTube Smart Chapters AI GitHub Push =====
echo This script will push your project to your existing GitHub repository.
echo Repository: https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git
echo.

REM Initialize git repository if not already done
if not exist .git (
    echo Initializing git repository...
    git init
    echo Git repository initialized successfully.
) else (
    echo Git repository already initialized.
)

REM Add all files to git
echo Adding files to git...
git add .

REM Commit changes
echo Committing files...
git commit -m "Update YouTube Smart Chapters AI"

REM Set up the remote repository
echo Setting up GitHub remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git

echo.
echo ===== Ready to Push Code =====
echo.

REM Push to GitHub
echo Pushing to GitHub...
echo This might require you to authenticate with GitHub.
echo.

echo Attempting to push to 'main' branch...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Failed to push to 'main' branch. Trying 'master' branch...
    git push -u origin master
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Could not push to GitHub. You might need to:
    echo - Use a personal access token instead of your password
    echo - Set up SSH key authentication
    echo See: https://docs.github.com/en/authentication
) else (
    echo.
    echo Successfully pushed to GitHub!
)

echo.
echo Press any key to exit...
pause >nul
