#!/usr/bin/env node

/**
 * Newspaper.AI Deployment Verification Script
 * 
 * This script checks if a Newspaper.AI deployment is working correctly
 * by making requests to key endpoints and verifying responses.
 * 
 * Usage:
 *   node verify-deployment.js https://your-deploy-url.onrender.com
 */

const axios = require('axios');
const https = require('https');

// Create axios instance with longer timeout and SSL validation disabled for testing
const api = axios.create({
  timeout: 30000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Get deployment URL from command line args
const deploymentUrl = process.argv[2];

if (!deploymentUrl) {
  console.error(`${colors.red}Error: Please provide the deployment URL as an argument.${colors.reset}`);
  console.error(`Example: node verify-deployment.js https://newspaper-ai.onrender.com`);
  process.exit(1);
}

// Tests to run on the deployment
const tests = [
  {
    name: 'Home Page',
    run: async () => {
      const response = await api.get(deploymentUrl);
      if (response.status !== 200) throw new Error(`Unexpected status code: ${response.status}`);
      if (!response.data.includes('html')) throw new Error('Response doesn\'t contain HTML');
      return true;
    }
  },
  {
    name: 'Static Assets',
    run: async () => {
      // Check if CSS loads properly
      const cssResponse = await api.get(`${deploymentUrl}/assets/index-B-BcZZbu.css`, {
        validateStatus: () => true
      });
      
      // If this specific CSS file doesn't exist, try getting any CSS file
      if (cssResponse.status !== 200) {
        const mainPageResponse = await api.get(deploymentUrl);
        const cssMatch = mainPageResponse.data.match(/href="\/assets\/index-.*?\.css"/);
        if (!cssMatch) throw new Error('No CSS file found in the HTML');
        
        const cssPath = cssMatch[0].split('"')[1];
        const altCssResponse = await api.get(`${deploymentUrl}${cssPath}`);
        if (altCssResponse.status !== 200) throw new Error('Failed to load CSS file');
      }
      
      return true;
    }
  },
  {
    name: 'SPA Routing',
    run: async () => {
      // Test that routes return the main app (SPA routing)
      const response = await api.get(`${deploymentUrl}/auth`, {
        headers: { 'Accept': 'text/html' },
        validateStatus: () => true
      });
      
      // Even though the route doesn't exist server-side, it should return the index.html
      // so the client-side router can handle it
      if (response.status !== 200) throw new Error(`Unexpected status code: ${response.status}`);
      if (!response.data.includes('html')) throw new Error('Response doesn\'t contain HTML');
      
      return true;
    }
  }
];

// Run verification tests
async function runTests() {
  console.log(`\n${colors.blue}===============================================${colors.reset}`);
  console.log(`${colors.blue}  Verifying Newspaper.AI Deployment${colors.reset}`);
  console.log(`${colors.blue}  URL: ${deploymentUrl}${colors.reset}`);
  console.log(`${colors.blue}===============================================${colors.reset}\n`);

  let allPassed = true;
  
  for (const test of tests) {
    process.stdout.write(`${colors.cyan}Testing ${test.name}...${colors.reset} `);
    
    try {
      await test.run();
      console.log(`${colors.green}PASSED${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}FAILED${colors.reset}`);
      console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
      allPassed = false;
    }
  }

  console.log(`\n${colors.blue}===============================================${colors.reset}`);
  
  if (allPassed) {
    console.log(`${colors.green}All tests passed! Your deployment appears to be working correctly.${colors.reset}`);
  } else {
    console.log(`${colors.red}Some tests failed. Please check the deployment logs and errors above.${colors.reset}`);
  }
  
  console.log(`${colors.blue}===============================================${colors.reset}\n`);

  // Additional verification instructions
  console.log(`${colors.magenta}Next Steps:${colors.reset}`);
  console.log(`1. Manually verify the site by visiting ${deploymentUrl}`);
  console.log(`2. Test user authentication and profile creation`);
  console.log(`3. Ensure news content loads correctly`);
  console.log(`4. Verify that dark mode toggle works`);
  console.log(`5. Test the search functionality\n`);
}

// Execute tests
runTests().catch(error => {
  console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
  process.exit(1);
}); 