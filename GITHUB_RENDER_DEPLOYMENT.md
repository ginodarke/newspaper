# Newspaper.AI GitHub and Render Deployment Guide

This guide will help you:
1. Clear your old GitHub repository
2. Push the new Newspaper.AI project to GitHub
3. Connect GitHub to Render for automatic deployment

## Prerequisites

- A GitHub account
- A GitHub personal access token with `repo` and `delete_repo` scopes
- A Render account (free tier is sufficient)
- Basic knowledge of Git commands

## Step 1: GitHub Setup

We've prepared a script to automate the GitHub setup process:

1. Edit the `github-setup.sh` script and update the following variables:
   ```bash
   GITHUB_USERNAME="your-username"
   GITHUB_REPO_NAME="newspaper-ai"  # Or your preferred name
   GITHUB_TOKEN="your-personal-access-token"
   ```

2. Make the script executable:
   ```bash
   chmod +x github-setup.sh
   ```

3. Run the script:
   ```bash
   ./github-setup.sh
   ```

This script will:
- Delete the existing repository with the same name (if you choose to)
- Create a new repository on GitHub
- Add it as a remote to your local repository
- Push your code to GitHub

## Step 2: Connect to Render

1. Log into [Render](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Select GitHub and authorize Render if prompted
5. Find and select your newly created `newspaper-ai` repository
6. Configure your service:
   - **Name**: newspaper-ai (or your preferred name)
   - **Region**: Choose the region closest to your users
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or choose a paid tier for production)

7. Click "Advanced" and add the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_NEWS_API_KEY`: Your News API key
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key

8. Click "Create Web Service"

## Step 3: Verify Deployment

1. Wait for Render to complete the initial deployment
2. Edit the `verify-deployment.sh` script and update the `RENDER_URL` variable:
   ```bash
   RENDER_URL="https://your-app-name.onrender.com"
   ```

3. Make the script executable:
   ```bash
   chmod +x verify-deployment.sh
   ```

4. Run the script:
   ```bash
   ./verify-deployment.sh
   ```

This script will check if your site is up and verify that key pages are accessible.

## Step 4: Set Up Continuous Deployment

Render automatically sets up continuous deployment. When you push changes to your GitHub repository, Render will automatically:
1. Detect the changes
2. Pull the latest code
3. Build and deploy your application

This ensures your application is always up to date with your latest code.

## Troubleshooting

### GitHub Issues
- Check your personal access token has the correct permissions
- Ensure you don't have rate limits on the GitHub API
- Verify your repository name doesn't violate naming rules

### Render Issues
- Check build logs for any errors
- Verify environment variables are correctly set
- Check that your start command is correct
- Make sure your instance has enough resources for your application

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html) 