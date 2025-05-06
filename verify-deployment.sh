#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Newspaper.AI Deployment Verification ====${NC}"

# Variables to be updated by the user
RENDER_URL=""  # e.g., https://newspaper-ai.onrender.com

# Check if URL is provided
if [ -z "$RENDER_URL" ]; then
    echo -e "${RED}Error: Please edit this script and provide your Render deployment URL.${NC}"
    exit 1
fi

# Function to check if site is up
check_site() {
    echo -e "${YELLOW}Checking if site is up at $RENDER_URL...${NC}"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $RENDER_URL)
    
    if [ $HTTP_STATUS -eq 200 ]; then
        echo -e "${GREEN}Site is up and running!${NC}"
        return 0
    else
        echo -e "${RED}Site returned HTTP status $HTTP_STATUS.${NC}"
        echo "This might be normal if the deployment is still in progress."
        return 1
    fi
}

# Function to check various pages
check_pages() {
    local pages=("/auth" "/onboarding" "/feed" "/profile")
    
    for page in "${pages[@]}"; do
        echo -e "${YELLOW}Checking page: $page${NC}"
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $RENDER_URL$page)
        
        if [ $HTTP_STATUS -eq 200 ]; then
            echo -e "${GREEN}Page $page is accessible!${NC}"
        else
            echo -e "${RED}Page $page returned HTTP status $HTTP_STATUS.${NC}"
            echo "This might be due to authentication requirements or routing issues."
        fi
    done
}

# Main verification process
echo -e "${YELLOW}Starting verification process...${NC}"

# Try up to 5 times with increasing delays
for i in {1..5}; do
    if check_site; then
        echo -e "${GREEN}Site verification successful!${NC}"
        echo -e "${YELLOW}Now checking individual pages...${NC}"
        check_pages
        break
    else
        echo -e "${YELLOW}Attempt $i failed. Waiting before next attempt...${NC}"
        sleep $((i * 10))  # Increasing wait time between attempts
    fi
    
    if [ $i -eq 5 ]; then
        echo -e "${RED}Site verification failed after 5 attempts.${NC}"
        echo "Please check your Render dashboard for deployment status and logs."
    fi
done

echo -e "${YELLOW}==== Verification process completed ====${NC}"
echo -e "Remember to check for:"
echo -e "1. Correct environment variables in Render"
echo -e "2. Authentication flow working properly"
echo -e "3. News article loading and display"
echo -e "4. User preferences correctly applied" 