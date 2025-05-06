# Deploying to Internal Render Instance

This guide will help you deploy the Newspaper.AI application to the internal Render instance at `pwn-project:10000`.

## Prerequisites

1. Network access to the internal Render instance
2. Render API key and service ID
3. GitHub credentials if you're connecting to GitHub

## Step 1: Configure Network Access

Ensure your machine can access the internal Render instance:

1. Add the Render instance to your hosts file:
   ```bash
   sudo echo "127.0.0.1 pwn-project" >> /etc/hosts
   ```

2. If the Render instance is on a different network, ensure you have VPN access or appropriate network routing.

## Step 2: Install Required Tools

1. Install Render CLI:
   ```bash
   # Method 1: Direct download
   curl -s https://render.com/download-cli/stable | bash
   
   # Method 2: From source
   git clone https://github.com/render-oss/render-cli.git
   cd render-cli
   make install
   ```

2. Install GitHub CLI (if needed):
   ```bash
   # macOS
   brew install gh
   
   # Ubuntu/Debian
   sudo apt install gh
   
   # Other methods
   # See: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
   ```

## Step 3: Configure Connection to Internal Render Instance

1. Configure Render CLI to use the internal instance:
   ```bash
   render config set --api-url http://pwn-project:10000/api
   ```

2. Authenticate with Render:
   ```bash
   render login --api-key YOUR_API_KEY
   ```

## Step 4: Use the Deployment Script

1. Edit the `deploy-to-render.sh` script and update these variables:
   ```bash
   RENDER_API_KEY="your-render-api-key"
   RENDER_SERVICE_ID="your-render-service-id"
   RENDER_HOST="pwn-project"
   RENDER_PORT=10000
   ```

2. Run the deployment script:
   ```bash
   ./deploy-to-render.sh
   ```

## Step 5: Manual Deployment (Alternative)

If the script doesn't work, you can deploy manually:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy using curl:
   ```bash
   curl -X POST "http://pwn-project:10000/api/v1/services/YOUR_SERVICE_ID/deploys" \
       -H "Authorization: Bearer YOUR_API_KEY" \
       -H "Content-Type: application/json"
   ```

## Troubleshooting

1. Connection issues:
   - Check network connectivity with `ping pwn-project`
   - Verify port access with `nc -zv pwn-project 10000`
   - Ensure your firewall allows connections to the internal instance

2. Authentication issues:
   - Verify your API key is correct
   - Check if your API key has the necessary permissions

3. Deployment issues:
   - Check if the build process completed successfully
   - Verify the service ID is correct
   - Check the response from the API call for error details

## GitHub Integration

If you need to connect the internal Render instance to GitHub:

1. Authenticate with GitHub:
   ```bash
   gh auth login
   ```

2. Configure GitHub integration in Render:
   ```bash
   render service create --github
   ```

3. Follow the prompts to connect your GitHub repository. 