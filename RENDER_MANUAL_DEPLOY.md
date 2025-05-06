# Manual Deployment to Render

Since the Render CLI is not available, follow these steps to manually deploy the Newspaper.AI application to Render.

## Prerequisites

1. A Render account (create one at https://render.com if you don't have one)
2. The built application (we've already run `npm run build`)
3. Access to the Supabase and OpenRouter API keys
4. At least one News API key (TheNewsAPI, NewsData.io, NewsAPI.org, or ApiTube)

## Obtaining News API Keys

To get real news articles working in the application, you'll need to obtain at least one of the following API keys:

1. **TheNewsAPI**: Sign up at https://www.thenewsapi.com/ (free tier available)
2. **NewsData.io**: Sign up at https://newsdata.io/ (free tier available)
3. **NewsAPI.org**: Sign up at https://newsapi.org/ (free tier available for development)
4. **ApiTube**: Sign up at https://apitube.io/ (free tier available)

## Deployment Steps

### 1. Create a new Web Service

1. Log in to your Render dashboard at https://dashboard.render.com/
2. Click the "New +" button in the top right and select "Web Service"
3. Connect your GitHub repository (or select "Deploy from existing repository" if already connected)
4. Find and select the Newspaper.AI repository

### 2. Configure the Web Service

Enter the following configuration:
- **Name**: `newspaper-ai`
- **Environment**: `Node`
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your preferred branch)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Instance Type**: Free (or paid tier if you need better performance)

### 3. Add Environment Variables

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

### 4. Create Web Service

Click "Create Web Service" to start the deployment process.

### 5. Monitor Deployment

The deployment will start automatically. You can monitor the progress in the Render dashboard. This may take a few minutes.

### 6. Access Your Application

Once deployed, your application will be available at the URL provided by Render:
- `https://newspaper-ai.onrender.com` (or a similar URL based on your service name)

## Troubleshooting

### If build fails
- Check the build logs for specific errors
- Verify that all dependencies are correctly listed in package.json
- Ensure the Node version is set correctly in environment variables

### If application fails to start
- Check the logs for runtime errors
- Verify that all environment variables are correctly set
- Ensure the start command is correct for your application

### If news articles aren't loading
- Verify that you've added at least one News API key to your environment variables
- Check the browser console for API errors, which might indicate rate limiting or subscription issues
- Try adding a different News API key if one is not working

## Post-Deployment

After successful deployment:

1. **Test Authentication**: Try signing up and logging in to ensure Supabase integration works
2. **Test Onboarding Flow**: Complete the onboarding process to verify it works properly
3. **Verify News Feed**: Check that articles load and display correctly from real news sources
4. **Test Dark Mode**: Ensure the theme toggle works properly
5. **Verify Search**: Test the search functionality with real search queries

If everything works as expected, your Newspaper.AI application is successfully deployed and ready to use! 