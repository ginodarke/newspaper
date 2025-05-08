#!/bin/bash

# Newspaper.AI Render Deployment Script
# This script helps prepare and deploy your Newspaper.AI application to Render

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Newspaper.AI Render Deployment Helper${NC}"
echo -e "${BLUE}===============================================${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed. Please install git first.${NC}"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes in your repository.${NC}"
    echo -e "Would you like to commit these changes before deployment? (y/n)"
    read -r commit_changes
    
    if [[ $commit_changes == "y" ]]; then
        echo -e "Enter commit message:"
        read -r commit_message
        
        git add .
        git commit -m "[Cursor] $commit_message"
        
        echo -e "${GREEN}Changes committed successfully.${NC}"
    else
        echo -e "${YELLOW}Proceeding without committing changes.${NC}"
    fi
fi

# Build the application
echo -e "\n${BLUE}Building the application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed. Please fix the build issues and try again.${NC}"
    exit 1
else
    echo -e "${GREEN}Build successful!${NC}"
fi

# Create or update environment variables file for Render
echo -e "\n${BLUE}Setting up environment variables...${NC}"

ENV_FILE="render-env-variables.txt"

# Check if the environment variables file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "Creating new environment variables file: $ENV_FILE"
    
    # Basic required variables
    cat > "$ENV_FILE" << EOF
NODE_VERSION=18
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=https://mrfcrewlkwrqtwzlxpra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZmNyZXdsa3dycXR3emx4cHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDQ3MzIsImV4cCI6MjA1OTcyMDczMn0.6jzgK-K6nntipO0ZSnmXSAvb53xqp7-uQF_S7KHDLJU
VITE_OPENROUTER_API_KEY=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
VITE_THENEWSAPI_KEY=c3AcERwz2ZsZc0ABKhwc00OnAOqhyCKAySAsdiSc
VITE_NEWSDATA_KEY=pub_8217957942c3b5247b479818ae6984adf5333
VITE_NEWSAPI_KEY=87ecc9641d894c0396b5495014879e9d
EOF
    
    echo -e "${GREEN}Environment variables file created.${NC}"
else
    echo -e "${GREEN}Using existing environment variables file.${NC}"
fi

# Provide instructions for deployment
echo -e "\n${BLUE}===============================================${NC}"
echo -e "${BLUE}  Deployment Instructions${NC}"
echo -e "${BLUE}===============================================${NC}"

echo -e "\n${YELLOW}1. Go to your Render dashboard: ${NC}https://dashboard.render.com/"
echo -e "${YELLOW}2. Click 'New' and select either:${NC}"
echo -e "   - Blueprint (recommended, uses render.yaml)"
echo -e "   - Web Service (manual setup)"
echo -e "${YELLOW}3. Connect your GitHub repository${NC}"
echo -e "${YELLOW}4. If using Web Service, configure with:${NC}"
echo -e "   - Environment: Node"
echo -e "   - Build Command: npm install && npm run build"
echo -e "   - Start Command: npm run start"
echo -e "${YELLOW}5. Add environment variables from:${NC} $ENV_FILE"
echo -e "${YELLOW}6. Deploy the service${NC}"

echo -e "\n${BLUE}===============================================${NC}"
echo -e "${GREEN}Your application is ready for deployment!${NC}"
echo -e "${BLUE}===============================================${NC}"

exit 0 