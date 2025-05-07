#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Creating GitHub Repository ====${NC}"

read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your GitHub personal access token: " GITHUB_TOKEN

# Create the repository on GitHub
echo -e "${YELLOW}Creating repository on GitHub...${NC}"
curl -X POST \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"newspaper-ai\",\"description\":\"Newspaper.AI - AI-powered news aggregator\",\"private\":false}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Repository created successfully!${NC}"
    echo -e "${GREEN}Now run ./setup-github-render.sh to push your code.${NC}"
else
    echo -e "${RED}Failed to create repository. Check your token and try again.${NC}"
fi 