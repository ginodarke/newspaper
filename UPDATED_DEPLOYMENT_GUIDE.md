# Updated Deployment Guide for Newspaper.AI

This guide provides step-by-step instructions to deploy the improved version of Newspaper.AI to Render.

## Pre-Deployment Checklist

1. Ensure the application builds successfully (we've fixed all TypeScript errors)
2. Verify all environment variables are ready to be configured on Render
3. Understand the deployment process using the `render.yaml` configuration

## Deployment Steps

### 1. Fork/Clone and Set Up the Repository

If you don't have the repository:

```bash
git clone https://github.com/yourusername/newspaper.git
cd newspaper
npm install
```

### 2. Build the Application Locally

Test the build locally to ensure everything works:

```bash
npm run build
```

As we've verified, the build should complete successfully.

### 3. Deploy to Render

#### Option 1: Manual Deployment via Dashboard

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click the "New +" button and select "Web Service"
3. Connect to your GitHub repository or use the "Deploy from existing repository" option
4. Configure your web service:
   - **Name**: `newspaper-ai`
   - **Environment**: `Node`
   - **Region**: Choose the region closest to your users
   - **Branch**: `main` (or your preferred branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: Free (or paid tier if needed)

5. Set the following environment variables:
   ```
   NODE_VERSION=18
   NODE_ENV=production
   PORT=10000
   VITE_SUPABASE_URL=https://mrfcrewlkwrqtwzlxpra.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZmNyZXdsa3dycXR3emx4cHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDQ3MzIsImV4cCI6MjA1OTcyMDczMn0.6jzgK-K6nntipO0ZSnmXSAvb53xqp7-uQF_S7KHDLJU
   VITE_OPENROUTER_API_KEY=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
   ```

6. Add at least one of these News API keys:
   ```
   VITE_THENEWSAPI_KEY=your_key_here
   VITE_NEWSDATA_KEY=your_key_here
   ```

7. Click "Create Web Service"

#### Option 2: Using render.yaml (Blueprint)

Render supports automatic deployment using the `render.yaml` file already included in the repository:

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Blueprint"
3. Connect to your GitHub repository
4. Configure environment variables as listed above
5. Click "Apply" to deploy

### 4. Monitor Deployment

Monitor the deployment logs for any errors. Common issues might include:

- Missing environment variables
- Build failures due to package.json misconfiguration
- Network errors when connecting to external APIs

### 5. Verify Deployment

After deployment completes:

1. Visit your Render URL (`https://newspaper-ai.onrender.com` or similar)
2. Test the following features:
   - Sign up and sign in
   - Complete the onboarding flow
   - View the news feed with real articles from APIs
   - Test 3D elements and animations
   - Verify dark mode toggle
   - Test news search functionality
   - Verify location-based news works properly

## Troubleshooting

### General Issues

- **Build Failures**: Check the build logs for specific errors
- **Runtime Errors**: Verify environment variables are correctly set
- **Styling Issues**: Refresh the page and clear browser cache
- **3D Elements Not Loading**: Check for console errors related to Three.js

### API Issues

- **News Articles Not Loading**: Verify API keys in environment variables
- **Empty News Feed**: Confirm at least one News API key is properly configured
- **Location Features Not Working**: Allow location access in your browser

### Authentication Issues

- **Sign Up/Sign In Not Working**: Verify Supabase keys are correctly configured
- **Preferences Not Saving**: Check Supabase database access and permissions

## Recent Fixes Applied

1. Fixed TypeScript errors in the 3D elements components
2. Updated code to properly handle optional location data
3. Improved the onboarding process with enhanced animations
4. Added proper error handling for news API requests
5. Fixed testing issues with proper testing library imports

## Next Steps

Once deployed successfully, consider:

1. Adding more comprehensive testing
2. Optimizing the 3D elements for better performance
3. Adding more news sources
4. Enhancing the AI summary functionality
5. Implementing user feedback mechanisms

## Support

If you encounter any issues not covered in this guide, please:

1. Check the browser console for errors
2. Verify your environment variables
3. Look at the deployment logs in your Render dashboard