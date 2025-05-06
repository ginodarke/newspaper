#!/bin/bash

# Script to connect to GitHub and deploy to Render

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Setting up GitHub and deploying to Render ====${NC}"

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}GitHub username is required.${NC}"
    exit 1
fi

# Set the repo name
GITHUB_REPO_NAME="newspaper-ai"

# Add the GitHub repository as remote
echo -e "${YELLOW}Adding GitHub remote...${NC}"
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}.git"
echo -e "${GREEN}Remote added successfully!${NC}"

# Push the code to GitHub
echo -e "${YELLOW}Pushing code to GitHub...${NC}"
git push -u origin main

# Check if the push was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Code pushed successfully to GitHub!${NC}"
    echo -e "${YELLOW}Your repository is now at: https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}${NC}"
    
    # Instructions for Render deployment
    echo -e "\n${YELLOW}==== Render Deployment Instructions ====${NC}"
    echo -e "1. Go to your Render dashboard at https://dashboard.render.com/"
    echo -e "2. Click 'New +' and select 'Web Service'"
    echo -e "3. Select 'Build and deploy from a Git repository'"
    echo -e "4. Connect to your GitHub repository: ${GITHUB_USERNAME}/${GITHUB_REPO_NAME}"
    echo -e "5. Configure your service with these settings:"
    echo -e "   - Name: newspaper-ai"
    echo -e "   - Root Directory: (leave empty)"
    echo -e "   - Environment: Node"
    echo -e "   - Build Command: npm ci && npm run build"
    echo -e "   - Start Command: npm start"
    echo -e "6. Add the following environment variables:"
    echo -e "   - VITE_SUPABASE_URL"
    echo -e "   - VITE_SUPABASE_ANON_KEY"
    echo -e "   - VITE_NEWS_API_KEY"
    echo -e "   - VITE_OPENAI_API_KEY"
    echo -e "7. Click 'Create Web Service'"
    echo -e "\n${GREEN}Once created, Render will automatically build and deploy your application.${NC}"
    echo -e "${GREEN}You can monitor the deployment in the Render dashboard.${NC}"
else
    echo -e "${RED}Failed to push code to GitHub. Please check your repository settings.${NC}"
    echo -e "Ensure the repository ${GITHUB_USERNAME}/${GITHUB_REPO_NAME} exists and you have push access."
fi 