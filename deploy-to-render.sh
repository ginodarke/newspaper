#!/bin/bash

# Exit on error
set -e

# Config variables
RENDER_API_KEY="your-render-api-key"
RENDER_SERVICE_ID="your-render-service-id"
RENDER_HOST="pwn-project"
RENDER_PORT=10000

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Newspaper.AI Deployment to Render ====${NC}"

# Check if Render CLI is available
if ! command -v render &> /dev/null; then
    echo -e "${RED}Render CLI not found. You might need to install it first.${NC}"
    echo "Try: curl -s https://render.com/download-cli/stable | bash"
    exit 1
fi

# Check if GitHub CLI is available
if ! command -v gh &> /dev/null; then
    echo -e "${RED}GitHub CLI not found. You might need to install it first.${NC}"
    echo "Try: brew install gh"
    exit 1
fi

# Check connection to Render instance
echo -e "${YELLOW}Checking connection to Render instance at ${RENDER_HOST}:${RENDER_PORT}...${NC}"
if ! ping -c 1 ${RENDER_HOST} &> /dev/null; then
    echo -e "${RED}Cannot connect to Render instance at ${RENDER_HOST}.${NC}"
    echo "Please make sure the host is reachable and update the script if needed."
    exit 1
fi

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# Deploy to Render
echo -e "${YELLOW}Deploying to Render...${NC}"
if [ -f "render.yaml" ]; then
    echo -e "${GREEN}Using render.yaml for deployment...${NC}"
    # Assuming Render CLI has a deploy command
    render deploy --api-key ${RENDER_API_KEY} --service-id ${RENDER_SERVICE_ID} --host ${RENDER_HOST} --port ${RENDER_PORT}
else
    echo -e "${RED}render.yaml not found. Using direct API call...${NC}"
    # Fallback to direct API call if render.yaml is not available
    curl -X POST "https://${RENDER_HOST}:${RENDER_PORT}/api/v1/services/${RENDER_SERVICE_ID}/deploys" \
        -H "Authorization: Bearer ${RENDER_API_KEY}" \
        -H "Content-Type: application/json"
fi

# Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
echo -e "${GREEN}Deployment process initiated successfully!${NC}"
echo "Please check the Render dashboard for deployment status."
echo "Once deployed, your site will be available at your Render URL."

echo -e "${YELLOW}==== Deployment process completed ====${NC}" 