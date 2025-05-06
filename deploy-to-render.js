/**
 * Deploy to Render via GitHub
 * 
 * This script automates deploying the Newspaper.AI application to Render via GitHub.
 * It sets up GitHub connection, pushes the code, and provides instructions for Render deployment.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

/**
 * Executes a shell command and returns the output
 */
function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: options.stdio || 'pipe',
      ...options
    });
  } catch (error) {
    console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
    if (error.stdout) console.error(`stdout: ${error.stdout}`);
    if (error.stderr) console.error(`stderr: ${error.stderr}`);
    throw error;
  }
}

/**
 * Prompt user for input
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.yellow}==== Newspaper.AI Deployment to Render via GitHub ====${colors.reset}\n`);
  
  try {
    // Verify everything is committed
    const status = exec('git status --porcelain');
    if (status.trim() !== '') {
      const shouldContinue = await prompt(`${colors.yellow}You have uncommitted changes. Commit them before continuing? (y/n): ${colors.reset}`);
      if (shouldContinue.toLowerCase() === 'y') {
        const commitMsg = await prompt(`${colors.yellow}Enter commit message: ${colors.reset}`);
        exec('git add .', { stdio: 'inherit' });
        exec(`git commit -m "[Cursor] ${commitMsg}"`, { stdio: 'inherit' });
        console.log(`${colors.green}Changes committed successfully!${colors.reset}\n`);
      } else {
        console.log(`${colors.red}Please commit your changes and try again.${colors.reset}`);
        rl.close();
        return;
      }
    }
    
    // Get GitHub username
    const username = await prompt(`${colors.yellow}Enter your GitHub username: ${colors.reset}`);
    if (!username) {
      console.log(`${colors.red}GitHub username is required.${colors.reset}`);
      rl.close();
      return;
    }
    
    // Repository configuration
    const repoName = 'newspaper-ai';
    console.log(`${colors.yellow}\nConfiguring GitHub repository: ${username}/${repoName}${colors.reset}`);
    
    // Remove existing remote (if any)
    try {
      exec('git remote remove origin');
    } catch (e) {
      // It's okay if this fails - just means there was no origin
    }
    
    // Add new remote
    exec(`git remote add origin https://github.com/${username}/${repoName}.git`);
    console.log(`${colors.green}Remote added successfully!${colors.reset}`);
    
    // Push to GitHub
    console.log(`${colors.yellow}\nPushing code to GitHub...${colors.reset}`);
    console.log(`${colors.yellow}You may be prompted for your GitHub credentials.${colors.reset}`);
    
    try {
      exec('git push -u origin main', { stdio: 'inherit' });
      console.log(`${colors.green}Code pushed successfully to GitHub!${colors.reset}`);
      
      // Show Render deployment instructions
      console.log(`\n${colors.yellow}==== Render Deployment Instructions ====${colors.reset}`);
      console.log(`
1. Go to your Render dashboard at ${colors.green}https://dashboard.render.com/${colors.reset}
2. Click ${colors.green}'New +'${colors.reset} and select ${colors.green}'Web Service'${colors.reset}
3. Select ${colors.green}'Build and deploy from a Git repository'${colors.reset}
4. Connect to your GitHub repository: ${colors.green}${username}/${repoName}${colors.reset}
5. Configure your service with these settings:
   - Name: ${colors.green}newspaper-ai${colors.reset}
   - Root Directory: ${colors.green}(leave empty)${colors.reset}
   - Environment: ${colors.green}Node${colors.reset}
   - Build Command: ${colors.green}npm ci && npm run build${colors.reset}
   - Start Command: ${colors.green}npm start${colors.reset}
6. Add the following environment variables:
   - ${colors.green}VITE_SUPABASE_URL${colors.reset}
   - ${colors.green}VITE_SUPABASE_ANON_KEY${colors.reset}
   - ${colors.green}VITE_NEWS_API_KEY${colors.reset}
   - ${colors.green}VITE_OPENAI_API_KEY${colors.reset}
7. Click ${colors.green}'Create Web Service'${colors.reset}
      `);
      
      console.log(`${colors.green}Once created, Render will automatically build and deploy your application.${colors.reset}`);
      console.log(`${colors.green}You can monitor the deployment in the Render dashboard.${colors.reset}`);
      
      // Create a verification script
      console.log(`\n${colors.yellow}Creating verification script...${colors.reset}`);
      const verificationScript = `#!/bin/bash
# Verify Render deployment
echo "Verify your deployment by entering the URL below"
echo "Then visit: https://your-app-url.onrender.com"
echo "Check that the site loads correctly and you can navigate to different pages"
echo "Make sure environment variables are properly set in the Render dashboard"
`;
      fs.writeFileSync('verify-render-deployment.sh', verificationScript);
      exec('chmod +x verify-render-deployment.sh');
      console.log(`${colors.green}Created verification script: verify-render-deployment.sh${colors.reset}`);
      
    } catch (error) {
      console.error(`${colors.red}Failed to push to GitHub.${colors.reset}`);
      console.error(`${colors.red}Make sure the repository ${username}/${repoName} exists on GitHub.${colors.reset}`);
      console.error(`${colors.red}If it doesn't exist, please create it first at https://github.com/new${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
  } finally {
    rl.close();
  }
}

// Run the script
main(); 