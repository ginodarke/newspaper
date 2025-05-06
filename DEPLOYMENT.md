# Deploying Newspaper.AI to Render

This guide will walk you through the process of deploying the Newspaper.AI application to Render.

## Prerequisites

- GitHub or GitLab account
- Render.com account
- Supabase account and project with credentials

## Step 1: Push Your Code to GitHub/GitLab

1. Create a new repository on GitHub or GitLab
2. Link your local repository to the remote repository:

```bash
git remote add origin https://github.com/yourusername/newspaper-ai.git
git push -u origin main
```

## Step 2: Deploy to Render

1. Log in to your Render account at https://dashboard.render.com
2. Click on the "New +" button and select "Static Site"
3. Connect your GitHub/GitLab account if you haven't already
4. Select the repository you just created
5. Configure your static site with the following settings:

   - **Name**: newspaper-ai (or any name you prefer)
   - **Branch**: main
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

6. Click "Create Static Site"

## Step 3: Configure Redirect Rules

Since this is a single-page application (SPA), you need to ensure all routes redirect to index.html. Render should handle this automatically if you have the render.yaml file in your repository, but you can also set it up manually:

1. Go to your site's dashboard on Render
2. Navigate to the "Redirects/Rewrites" tab
3. Add a new rule:
   - Source: `/*`
   - Destination: `/index.html`
   - Type: Rewrite

## Step 4: Verify Deployment

1. Wait for the build and deployment to complete
2. Click on the URL provided by Render to view your deployed application
3. Test the application to ensure all functionality works correctly

## Step 5: Set Up Continuous Deployment (Optional)

Render automatically deploys your application when you push to the main branch. If you want to use GitHub Actions for additional CI/CD, you can:

1. Ensure your repository has the `.github/workflows/deploy.yml` file
2. Get your Render API key from the Render dashboard
3. Add the following secrets to your GitHub repository:
   - `RENDER_API_KEY`: Your Render API key
   - `RENDER_SERVICE_ID`: Your Render service ID

With this setup, whenever you push to the main branch, GitHub Actions will run your tests and trigger a deployment on Render.

## Troubleshooting

- If your application fails to build, check the build logs in the Render dashboard
- Ensure your environment variables are set correctly
- For routing issues, verify that the redirect rules are properly configured
- If you encounter CORS issues with Supabase, ensure your Supabase project has the correct URL allowlisted 