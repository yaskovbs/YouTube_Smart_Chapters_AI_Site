# GitHub Setup Instructions

This document provides instructions for setting up the YouTube Smart Chapters AI project on GitHub.

## Prerequisites

- [Git](https://git-scm.com/downloads) installed on your computer
- A [GitHub](https://github.com/) account

## Using the Setup Script

We've provided a script that will help you initialize the repository and set up the GitHub remote. To use it:

### For Windows (using Git Bash or similar):

1. Open Git Bash or Command Prompt in the project directory
2. Make the script executable (if using Git Bash):
   ```bash
   chmod +x github-setup.sh
   ```
3. Run the script:
   ```bash
   ./github-setup.sh
   ```
   
### For Windows (using PowerShell):

1. Open PowerShell in the project directory
2. Run the script with Bash:
   ```powershell
   bash github-setup.sh
   ```

### For macOS/Linux:

1. Open Terminal in the project directory
2. Make the script executable:
   ```bash
   chmod +x github-setup.sh
   ```
3. Run the script:
   ```bash
   ./github-setup.sh
   ```

## Manual Setup (Alternative)

If you prefer to set up GitHub manually, follow these steps:

1. Create a new repository on GitHub:
   - Go to [https://github.com/new](https://github.com/new)
   - Name your repository (e.g., "YouTube-Smart-Chapters-AI")
   - Choose public or private visibility
   - Do NOT initialize with README, .gitignore, or license files

2. Initialize a git repository in the project directory:
   ```bash
   git init
   ```

3. Add all files to git:
   ```bash
   git add .
   ```

4. Commit the files:
   ```bash
   git commit -m "Initial commit"
   ```

5. Link to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
   ```

6. Push to GitHub:
   ```bash
   git push -u origin main
   ```
   (If your default branch is "master" instead of "main", use `git push -u origin master`)

## Additional Information

- You might need to authenticate with GitHub when pushing for the first time.
- If you're having authentication issues, refer to [GitHub's documentation on authentication](https://docs.github.com/en/authentication).
- When creating a repository on GitHub, you should NOT initialize it with a README, .gitignore, or license file, as these would conflict with your local files.
