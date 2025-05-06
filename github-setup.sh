#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Newspaper.AI GitHub Setup ====${NC}"

# Variables to be updated by the user
GITHUB_USERNAME=""
GITHUB_REPO_NAME="newspaper-ai"
GITHUB_TOKEN=""

# Check if variables are set
if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: Please edit this script and provide your GitHub username and personal access token.${NC}"
    echo "You can generate a token at: https://github.com/settings/tokens"
    echo "Required scopes: repo, delete_repo"
    exit 1
fi

# Delete existing repository if needed
read -p "Do you want to delete an existing repository with the same name? (y/n): " DELETE_REPO
if [ "$DELETE_REPO" = "y" ]; then
    echo -e "${YELLOW}Deleting existing repository ${GITHUB_USERNAME}/${GITHUB_REPO_NAME}...${NC}"
    curl -X DELETE \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        "https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}"
    echo -e "${GREEN}Repository deleted successfully!${NC}"
    sleep 5  # Wait for GitHub to process the deletion
fi

# Create new repository on GitHub
echo -e "${YELLOW}Creating new repository ${GITHUB_USERNAME}/${GITHUB_REPO_NAME}...${NC}"
curl -X POST \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"${GITHUB_REPO_NAME}\",\"description\":\"Newspaper.AI - AI-powered news aggregator\",\"private\":false}"
echo -e "${GREEN}Repository created successfully!${NC}"

# Add remote to local repository
echo -e "${YELLOW}Adding remote to local repository...${NC}"
git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}.git"
echo -e "${GREEN}Remote added successfully!${NC}"

# Push code to GitHub
echo -e "${YELLOW}Pushing code to GitHub...${NC}"
git push -u origin main --force
echo -e "${GREEN}Code pushed successfully!${NC}"

echo -e "${YELLOW}==== GitHub Setup Completed ====${NC}"
echo -e "Next steps:"
echo -e "1. Log into Render.com"
echo -e "2. Click 'New +' and select 'Web Service'"
echo -e "3. Connect your GitHub repository"
echo -e "4. Configure build settings and environment variables"

echo -e "${GREEN}For detailed instructions, see github-render-steps.md${NC}" 