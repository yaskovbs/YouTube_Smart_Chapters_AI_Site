#!/bin/bash
# This script helps initialize a git repository and push to GitHub
# Run this script from the root of your project

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

echo "==== YouTube Smart Chapters AI GitHub Setup ===="
echo "This script will help you initialize a git repository and push to GitHub."
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
echo "Committing initial files..."
git commit -m "Initial commit of YouTube Smart Chapters AI"

# Prompt for GitHub username
echo ""
echo "Enter your GitHub username:"
read github_username

# Prompt for repository name
echo "Enter your GitHub repository name (default: YouTube-Smart-Chapters-AI):"
read github_repo
github_repo=${github_repo:-YouTube-Smart-Chapters-AI}

# Check if remote origin exists
if git remote | grep origin > /dev/null; then
    echo "Remote 'origin' already exists. Do you want to replace it? (y/n)"
    read replace_origin
    if [ "$replace_origin" = "y" ]; then
        git remote remove origin
        echo "Setting up GitHub remote repository..."
        git remote add origin "https://github.com/$github_username/$github_repo.git"
    fi
else
    echo "Setting up GitHub remote repository..."
    git remote add origin "https://github.com/$github_username/$github_repo.git"
fi

echo ""
echo "==== Next Steps ===="
echo "1. Create a new repository on GitHub at: https://github.com/new"
echo "   - Name: $github_repo"
echo "   - Make it public or private as you prefer"
echo "   - Do NOT initialize with README, .gitignore, or license"
echo ""
echo "2. Push your code to GitHub with:"
echo "   git push -u origin main"
echo "   (if you're using 'master' branch, use: git push -u origin master)"
echo ""
echo "3. If you have authentication issues, you may need to:"
echo "   - Configure GitHub CLI"
echo "   - Use a personal access token"
echo "   - Set up SSH key authentication"
echo "   See: https://docs.github.com/en/authentication"
echo ""
echo "Setup completed successfully!"
