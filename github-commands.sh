#!/bin/bash
# Direct GitHub commands as provided by GitHub

# Initialize git repository
git init

# Add all files (instead of just README.md to include the whole project)
git add .

# Commit changes
git commit -m "first commit"

# Rename the branch to main
git branch -M main

# Set the remote repository
git remote add origin https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git

# Push to GitHub
git push -u origin main

echo "Pushed project to GitHub: https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git"
