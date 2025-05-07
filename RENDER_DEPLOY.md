# Deploying Newspaper.AI to Render

## Prerequisites
- A Render account (sign up at [render.com](https://render.com) if you don't have one)
- GitHub repository with your Newspaper.AI code
- API keys for:
  - Supabase
  - OpenRouter
  - At least one news API (TheNewsAPI, NewsData.io, NewsAPI.org, or ApiTube)

## Important Note
This application is designed to be deployed on Render and accessed through the Render-provided URL. It is not meant to be served from your local machine. Development testing should be done using `npm run dev` which uses Vite's development server.

## Deployment Steps

### 1. Log in to Render Dashboard
- Go to [dashboard.render.com](https://dashboard.render.com/) and log in with your account

### 2. Create a New Web Service
- Click the "New +" button in the top right corner
- Select "Web Service" from the dropdown menu

### 3. Connect Your Repository
- Choose "Connect a repository" option
- Select GitHub as your Git provider and authorize if needed
- Find and select your Newspaper.AI repository

### 4. Configure the Service
- **Name**: `newspaper-ai` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your preferred branch)
- **Runtime Environment**: Node

### 5. Set Build and Start Commands
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### 6. Set Environment Variables
Click "Advanced" and add the following environment variables:

```
NODE_VERSION=18
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=https://mrfcrewlkwrqtwzlxpra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZmNyZXdsa3dycXR3emx4cHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDQ3MzIsImV4cCI6MjA1OTcyMDczMn0.6jzgK-K6nntipO0ZSnmXSAvb53xqp7-uQF_S7KHDLJU
VITE_OPENROUTER_API_KEY=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
```

**Add at least one of these News API keys:**
```
VITE_THENEWSAPI_KEY=your_api_key_here
VITE_NEWSDATA_KEY=your_api_key_here
VITE_NEWSAPI_KEY=your_api_key_here
VITE_APITUBE_KEY=your_api_key_here
```

### 7. Select Instance Type
- Choose "Free" for testing purposes or select a paid plan for production use

### 8. Create Web Service
- Click "Create Web Service" to start the deployment process

### 9. Monitor Deployment
- Wait for the build and deployment process to complete
- You can view the logs in real-time to check for any errors

### 10. Access Your Application
Once deployed, your application will be available at the URL provided by Render:
- `https://newspaper-ai.onrender.com` (or similar URL based on your service name)

## Production vs Development

### Production (Render)
- Uses the `server.js` Express server to serve the built static files
- Accessed via the Render-provided URL (e.g., https://newspaper-ai.onrender.com)
- All environment variables are set in the Render dashboard
- Optimized for performance with compression and proper caching

### Development (Local)
- Uses Vite's development server via `npm run dev`
- Accessed at http://localhost:3000
- Environment variables are loaded from .env.local file
- Provides hot module replacement and other development features

## Checking Deployment Status
1. From the Render dashboard, click on your web service
2. View the current status, logs, and events
3. Check the "Events" tab to see deployment history

## Troubleshooting

### If Build Fails
- Check the logs for error messages
- Verify all dependencies are correctly specified in package.json
- Ensure Node version is set correctly

### If Application Crashes
- Check logs for runtime errors
- Verify all environment variables are set correctly
- Make sure the start command is appropriate for your application

### If News Articles Don't Load
- Verify you've added at least one News API key
- Check browser console for API errors
- Try using a different News API provider

## Post-Deployment Verification
After successful deployment, test the following using the Render-provided URL:
1. User authentication (sign up and sign in)
2. Onboarding flow
3. News feed loads real articles 
4. Dark mode toggle
5. Search functionality
6. User profile management

## Updating Your Deployment
- Any new commits to your main branch (or selected branch) will automatically trigger a new deployment if auto-deploy is enabled
- You can manually trigger a deployment from the Render dashboard by clicking "Manual Deploy" > "Deploy latest commit"

---

**Note:** The R3F hooks issue has been fixed in the latest commit. The application should now deploy and run without the "Hooks can only be used within the Canvas component!" error. 