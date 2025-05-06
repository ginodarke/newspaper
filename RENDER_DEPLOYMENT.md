# Deploying to Render with Public URL

This guide explains how to deploy the Newspaper.AI application to Render with a public URL.

## Deployment Steps

1. **Push your latest code to GitHub**:
   ```bash
   git add .
   git commit -m "[Cursor] Configure for Render deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**:
   - Go to your [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" and select "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub account and select your "newspaper" repository

3. **Configure the Web Service**:
   - **Name**: newspaper
   - **Region**: Choose the closest to your users
   - **Branch**: main
   - **Root Directory**: (leave empty)
   - **Environment**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (or your preferred tier)

4. **Configure Environment Variables**:
   - Click "Advanced" and add these environment variables:
     - `VITE_OPENROUTER_API_KEY`: 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
     - `VITE_SUPABASE_URL`: (your Supabase URL)
     - `VITE_SUPABASE_ANON_KEY`: (your Supabase anon key)
     - `VITE_NEWS_API_KEY`: (your News API key)
     - `PORT`: 10000
     - `NODE_ENV`: production

5. **Deploy**:
   - Click "Create Web Service"
   - Render will start the deployment process automatically

## Why This Works

1. **Node.js Express Server**: We're using a simple Express server (`server.js`) to serve the static files built by Vite.

2. **Proper Port Configuration**: 
   - The server listens on the port specified by Render's `PORT` environment variable
   - This ensures Render can route traffic to your application

3. **SPA Routing**: 
   - The Express server redirects all requests to `index.html`
   - This enables React Router to handle client-side routing

## Accessing Your Deployed Application

Once deployed, Render will provide a URL like:
```
https://newspaper.onrender.com
```

You can see this URL in your Render dashboard. This is the public URL where your application is available.

## Monitoring and Logs

- View logs in the Render dashboard under the "Logs" tab
- Monitor deploy status in the "Events" tab
- Check service health in the "Overview" tab

## Custom Domain (Optional)

If you want to use your own domain instead of the Render URL:

1. Go to your service in the Render dashboard
2. Click on "Settings" > "Custom Domain"
3. Follow the instructions to add and verify your domain

## Troubleshooting

If your deployment has issues:

1. **Check the build logs** for any errors during the build process
2. **Verify environment variables** are correctly set
3. **Test your server.js** locally before deploying:
   ```bash
   npm run build
   node server.js
   ```
   Then visit http://localhost:10000 