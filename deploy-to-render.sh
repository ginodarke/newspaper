#!/bin/bash

# Script to deploy Newspaper.AI to Render
# This script assumes you have the Render CLI installed and authenticated
# Usage: ./deploy-to-render.sh

echo "Starting deployment of Newspaper.AI to Render..."

# Build the application
echo "Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed! Aborting deployment."
  exit 1
fi

echo "Build successful!"

# Create a Render service if it doesn't exist
SERVICE_NAME="newspaper-ai"
SERVICE_EXISTS=$(render service list | grep $SERVICE_NAME || echo "")

if [ -z "$SERVICE_EXISTS" ]; then
  echo "Creating new Render service: $SERVICE_NAME"
  render services create
else
  echo "Service $SERVICE_NAME already exists, deploying new version..."
fi

# Deploy to Render
echo "Deploying to Render..."
render deploy $SERVICE_NAME

echo "Deployment complete! Your app should be available in a few minutes."
echo "Visit: https://dashboard.render.com/web/$SERVICE_NAME to check status." 