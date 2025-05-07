# Direct Deployment Steps for Newspaper.AI

Since your GitHub is already connected to Cursor and Render, follow these direct steps to deploy:

## 1. Push Your Code to GitHub

```bash
# If you don't have a GitHub repository yet, create one at:
# https://github.com/new
# Name it "newspaper-ai" and make it public

# Set your GitHub repository as the remote origin
git remote add origin https://github.com/YOUR-USERNAME/newspaper-ai.git

# Push your code
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## 2. Deploy to Render

1. Go to your Render dashboard: https://dashboard.render.com/

2. Click "New +" and select "Web Service"

3. Choose "Build and deploy from a Git repository"

4. Select your GitHub account and find the "newspaper-ai" repository

5. Configure the service:
   - **Name**: newspaper-ai
   - **Root Directory**: (leave empty)
   - **Environment**: Node
   - **Build Command**: npm ci && npm run build
   - **Start Command**: npm start
   - **Instance Type**: Free (or choose a paid tier for production)

6. Add these environment variables:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anonymous key
   - `VITE_NEWS_API_KEY` = Your News API key
   - `VITE_OPENROUTER_API_KEY` = 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

7. Click "Create Web Service"

## 3. Monitor Deployment

1. Render will automatically start building and deploying your application
2. You can monitor the progress in the "Events" tab
3. Once deployment is complete, you can access your application at the URL provided by Render

## 4. Verify Deployment

1. Visit your application URL
2. Check that you can navigate to different pages:
   - Auth page
   - Onboarding page
   - News feed page
   - Profile page
3. Verify that user authentication works
4. Ensure news articles load correctly 