# GitHub and Render Setup Guide

## Step 1: Push to GitHub
Replace `YOUR-USERNAME` with your actual GitHub username and `newspaper-ai` with your desired repository name:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/newspaper-ai.git

# Push your code to GitHub
git push -u origin main
```

## Step 2: Connect to Render

1. Log into Render.com
2. Click 'New +' and select 'Web Service'
3. Select 'Build and deploy from a Git repository'
4. Connect your GitHub account if not already connected
5. Find and select your newspaper-ai repository
6. Configure your service with these settings:
   - Name: newspaper-ai
   - Environment: Node
   - Build Command: npm install && npm run build
   - Start Command: npm start
7. Click 'Create Web Service'

## Step 3: Configure Environment Variables

1. In your Render dashboard, go to your newspaper-ai service
2. Click on "Environment" 
3. Add necessary environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_NEWS_API_KEY
   - VITE_OPENAI_API_KEY
4. Click "Save Changes"

## Step 4: Verify Deployment

1. Render will automatically build and deploy your application
2. Check the "Logs" tab to monitor the deployment process
3. Once complete, click the link at the top of the page to view your deployed application 