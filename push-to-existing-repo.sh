#!/bin/bash
# This script helps push the current project to an existing GitHub repository
# Run this script from the root of your project

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

echo "==== YouTube Smart Chapters AI GitHub Push ===="
echo "This script will help you push to your existing GitHub repository."
echo "Repository: https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git"
echo ""

# Initialize git repository if not already done
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    echo "Git repository initialized successfully."
else
    echo "Git repository already initialized."
fi

# Add all files to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing files..."
git commit -m "Update YouTube Smart Chapters AI"

# Check if remote origin exists
if git remote | grep origin > /dev/null; then
    echo "Remote 'origin' already exists. Do you want to replace it? (y/n)"
    read replace_origin
    if [ "$replace_origin" = "y" ]; then
        git remote remove origin
        echo "Setting up GitHub remote repository..."
        git remote add origin "https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git"
    fi
else
    echo "Setting up GitHub remote repository..."
    git remote add origin "https://github.com/yaskovbs/YouTube_Smart_Chapters_AI.git"
fi

echo ""
echo "==== Ready to Push Code ===="
echo "Your code is now ready to be pushed to GitHub."
echo ""
echo "Run the following command to push your code:"
echo "git push -u origin main"
echo ""
echo "If your default branch is 'master' instead of 'main', use:"
echo "git push -u origin master"
echo ""
echo "If you encounter authentication issues, you might need to:"
echo "- Use a personal access token instead of your password"
echo "- Set up SSH key authentication"
echo "See: https://docs.github.com/en/authentication"
echo ""
echo "Setup completed successfully!"
