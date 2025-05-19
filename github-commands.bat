@echo off
:: Direct GitHub commands as provided by GitHub for Windows users

echo === Initializing Git Repository ===
git init

echo === Adding All Files ===
git add .

echo === Committing Changes ===
git commit -m "first commit"

echo === Renaming Branch to main ===
git branch -M main

echo === Setting Remote Repository ===
git remote add origin https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git

echo === Pushing to GitHub ===
git push -u origin main

echo.
echo Pushed project to GitHub: https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git
echo.
echo Press any key to exit...
pause >nul
