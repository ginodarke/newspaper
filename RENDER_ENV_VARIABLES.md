# Render Environment Variables for Newspaper.AI

When setting up your Newspaper.AI application on Render, you need to configure the following environment variables:

## Required Environment Variables

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_OPENROUTER_API_KEY` | `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` | Your OpenRouter API key |
| `VITE_SUPABASE_URL` | `your-value-here` | URL for your Supabase instance |
| `VITE_SUPABASE_ANON_KEY` | `your-value-here` | Anonymous key for Supabase authentication |
| `VITE_NEWS_API_KEY` | `your-value-here` | API key for news service |

## How to Add Environment Variables in Render

1. Go to your Render dashboard
2. Select your Newspaper.AI service
3. Click on the "Environment" tab
4. Add each variable and its value
5. Click "Save Changes"

## Deployment Settings

Use these settings for your Render deployment:

- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`

## Connecting GitHub to Render

Your GitHub repository is now available at: https://github.com/ginodarke/newspaper.git

To connect it to Render:

1. In Render dashboard, click "New +" and select "Web Service"
2. Choose "Build and deploy from a Git repository"
3. Connect to GitHub and select your "newspaper" repository
4. Configure with the settings and environment variables listed above
5. Click "Create Web Service" 