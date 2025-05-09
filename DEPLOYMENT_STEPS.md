# Newspaper.AI Deployment Guide for Render

This document provides detailed steps to deploy the Newspaper.AI application to Render.

## Prerequisites

- A Render account (sign up at [render.com](https://render.com) if you don't have one)
- Your GitHub repository connected to Render
- The necessary API keys for news services and Supabase

## Deployment Methods

You can deploy to Render using either:
1. **Render Blueprint (Recommended)** - Using the existing `render.yaml` file
2. **Manual Web Service Setup** - Through the Render dashboard

## Method 1: Deploy using Render Blueprint (render.yaml)

### Step 1: Prepare Your Repository

Ensure your repository contains:
- The `render.yaml` file (already included in your repo)
- A valid `package.json` with build and start scripts
- The `server.js` file for serving the built application (this file is crucial - it serves your SPA and handles routing)

### Step 2: Connect to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click "New" in the top right corner
3. Select "Blueprint" from the dropdown menu
4. Connect your GitHub repository if not already connected
5. Select the repository containing the Newspaper.AI application
6. Click "Connect"

### Step 3: Configure Environment Variables

The render.yaml file already defines the structure, but you'll need to set up the secret environment variables:

1. You'll be prompted to enter values for:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENROUTER_API_KEY`
   - `VITE_NEWS_API_KEY` (or another compatible news API)

2. Enter the values from your `RENDER_ENVIRONMENT_VARIABLES.env` file:
   - Supabase URL: `https://mrfcrewlkwrqtwzlxpra.supabase.co`
   - Supabase Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZmNyZXdsa3dycXR3emx4cHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDQ3MzIsImV4cCI6MjA1OTcyMDczMn0.6jzgK-K6nntipO0ZSnmXSAvb53xqp7-uQF_S7KHDLJU`
   - OpenRouter API Key: `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`
   - At least one of these news API keys:
     - `VITE_THENEWSAPI_KEY=c3AcERwz2ZsZc0ABKhwc00OnAOqhyCKAySAsdiSc`
     - `VITE_NEWSDATA_KEY=pub_8217957942c3b5247b479818ae6984adf5333`
     - `VITE_NEWSAPI_KEY=87ecc9641d894c0396b5495014879e9d`

### Step 4: Deploy the Blueprint

1. Review all settings to ensure they're correct
2. Click "Apply Blueprint"
3. Render will now create and deploy your web service

### Step 5: Monitor Deployment

1. Monitor the build logs for any errors
2. Wait for the deployment to complete (usually takes 5-10 minutes)
3. Once deployed, Render will provide you with a URL (like `https://newspaper-ai.onrender.com`)

## Method 2: Manual Web Service Setup

### Step 1: Create a New Web Service

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect to your GitHub repository
4. Select the repository containing the Newspaper.AI application

### Step 2: Configure the Service

Configure the following settings:
- **Name**: `newspaper-ai` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose the closest to your users
- **Branch**: `main` (or your deployment branch)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Instance Type**: Free (or paid tier if needed)

### Step 3: Add Environment Variables

Add the following environment variables:
```
NODE_VERSION=18
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=https://mrfcrewlkwrqtwzlxpra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZmNyZXdsa3dycXR3emx4cHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDQ3MzIsImV4cCI6MjA1OTcyMDczMn0.6jzgK-K6nntipO0ZSnmXSAvb53xqp7-uQF_S7KHDLJU
VITE_OPENROUTER_API_KEY=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
```

And at least one of these news API keys:
```
VITE_THENEWSAPI_KEY=c3AcERwz2ZsZc0ABKhwc00OnAOqhyCKAySAsdiSc
VITE_NEWSDATA_KEY=pub_8217957942c3b5247b479818ae6984adf5333
VITE_NEWSAPI_KEY=87ecc9641d894c0396b5495014879e9d
```

### Step 4: Create Web Service

Click "Create Web Service" and Render will begin the deployment process.

## Verifying Your Deployment

After deployment, verify the following:

1. Run the verification script to automatically check key endpoints:
   ```
   node verify-deployment.js
   ```
   This script will test multiple routes and report any issues.

2. Visit your Render URL (e.g., `https://newspaper-ai.onrender.com`)
2. Ensure the home page loads with the modern UI design
3. Test user flow:
   - Browsing without logging in
   - Creating an account and logging in
   - Setting up a profile (using the "Set Up Profile" link)
   - Viewing personalized news feeds
   - Testing dark mode toggle
   - Using the search functionality

## Troubleshooting

### Common Issues:

#### "Application Error" on Render
- Check if `server.js` exists and is properly configured
- Verify that the start command in render.yaml is correctly set to `npm start`
- Check the Render logs for detailed error messages
- Make sure express and compression packages are installed

#### Build Failures
- Check for missing dependencies in package.json
- Verify Node.js version compatibility
- Look for TypeScript compilation errors

#### Runtime Errors
- Ensure all required environment variables are set
- Check for CORS issues with your Supabase instance
- Verify API keys are valid and have necessary permissions

#### Content Not Loading
- Check browser console for errors
- Verify News API keys are properly configured
- Clear browser cache and refresh

#### Supabase Authentication Issues
- Confirm Supabase URL and anon key are correct
- Check Supabase dashboard for authentication settings

## Next Steps After Deployment

Once deployed successfully:

1. **Set up monitoring**: Enable Render's logging and monitoring features
2. **Configure custom domain**: Add a custom domain in Render settings if needed
3. **Enable auto-deployments**: Ensure auto-deployments are enabled to keep the site updated
4. **Gather user feedback**: Create a feedback mechanism for early users

## Support

If you encounter issues not covered in this guide:
1. Check Render's deployment logs
2. Verify all environment variables
3. Review browser console for client-side errors
4. Check Supabase logs for backend issues 