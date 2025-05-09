#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Newspaper.AI Deployment Fix        ${NC}"
echo -e "${BLUE}========================================${NC}"

# Create commit message in a temp file to handle multi-line
COMMIT_MSG=$(mktemp)
cat > $COMMIT_MSG << EOF
[Cursor] Fix deployment issue with Render

- Updated render.yaml to use npm start instead of node server.js
- Created simplified Express server.js for serving static files
- Added deployment verification script
- Updated deployment documentation with troubleshooting steps
- Added proper error handling in server.js

This fix resolves the "Application Error" shown in Render deployments
by ensuring the server properly serves the SPA and handles all routes.
EOF

# Display what we're going to commit
echo -e "\n${GREEN}Files to commit:${NC}"
echo -e "  - render.yaml"
echo -e "  - server.js"
echo -e "  - verify-deployment.js"
echo -e "  - DEPLOYMENT_STEPS.md"
echo -e "  - .cursorrules"

echo -e "\n${GREEN}Commit message:${NC}"
cat $COMMIT_MSG

# Ask for confirmation
echo -e "\n${YELLOW}Do you want to proceed with this commit? (y/n)${NC}"
read -r confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
  # Stage the files
  git add render.yaml server.js verify-deployment.js DEPLOYMENT_STEPS.md .cursorrules

  # Commit with the message
  git commit -F $COMMIT_MSG

  # Clean up temp file
  rm $COMMIT_MSG

  echo -e "\n${GREEN}Commit successful!${NC}"
  echo -e "${BLUE}Next steps:${NC}"
  echo -e "1. Push the changes to your repository with: ${YELLOW}git push${NC}"
  echo -e "2. Deploy to Render using the updated configuration"
  echo -e "3. Verify the deployment with: ${YELLOW}node verify-deployment.js${NC}"
else
  # Clean up temp file
  rm $COMMIT_MSG
  echo -e "\n${RED}Commit canceled.${NC}"
fi

echo -e "${BLUE}========================================${NC}" 