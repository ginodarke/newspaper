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

const https = require('https');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Print a styled header
console.log(`\n${colors.bright}${colors.cyan}=== Newspaper.AI Deployment Verification ====${colors.reset}\n`);

// Ask for deployment URL
rl.question(`${colors.yellow}Enter the deployment URL to verify (e.g., https://newspaper-ai.onrender.com): ${colors.reset}`, (deploymentUrl) => {
  console.log(`\n${colors.blue}Verifying deployment at: ${deploymentUrl}${colors.reset}\n`);
  
  // Remove trailing slash if present
  deploymentUrl = deploymentUrl.endsWith('/') ? deploymentUrl.slice(0, -1) : deploymentUrl;

  // Update URLs to test with more generic asset paths
  const urlsToTest = [
    { url: '/', name: 'Home page' },
    { url: '/auth', name: 'Auth page' },
    { url: '/feed', name: 'News feed page' },
    { url: '/profile', name: 'Profile page' },
    { url: '/search', name: 'Search page' },
    // Use the root path to check for general site functionality
    { url: '/', name: 'Site functionality verification' }
  ];

  let completedChecks = 0;
  let successfulChecks = 0;

  // Function to make HTTP requests
  function checkEndpoint(endpoint) {
    const url = `${deploymentUrl}${endpoint.url}`;
    
    console.log(`${colors.dim}Testing: ${url}${colors.reset}`);
    
    https.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
      
      let success = false;
      let message = '';
      
      // Check if status code is successful (200-299)
      if (statusCode >= 200 && statusCode < 300) {
        if (endpoint.expectType && !contentType.includes(endpoint.expectType)) {
          message = `${colors.yellow}⚠️ WARNING: ${endpoint.name} returned unexpected content type: ${contentType}${colors.reset}`;
        } else {
          success = true;
          message = `${colors.green}✅ SUCCESS: ${endpoint.name} (${statusCode})${colors.reset}`;
          successfulChecks++;
        }
      } else if (statusCode === 301 || statusCode === 302) {
        // Redirects are OK for some routes
        success = true;
        message = `${colors.green}✅ SUCCESS: ${endpoint.name} - Redirect (${statusCode}) to ${res.headers.location}${colors.reset}`;
        successfulChecks++;
      } else {
        message = `${colors.red}❌ FAILED: ${endpoint.name} - Status code: ${statusCode}${colors.reset}`;
      }
      
      console.log(message);
      
      res.resume(); // Consume response data to free up memory
      
      completedChecks++;
      if (completedChecks === urlsToTest.length) {
        summarizeResults(successfulChecks, urlsToTest.length);
      }
    }).on('error', (e) => {
      console.log(`${colors.red}❌ FAILED: ${endpoint.name} - ${e.message}${colors.reset}`);
      completedChecks++;
      if (completedChecks === urlsToTest.length) {
        summarizeResults(successfulChecks, urlsToTest.length);
      }
    });
  }
  
  // Function to summarize results
  function summarizeResults(successful, total) {
    console.log(`\n${colors.bright}==== Verification Summary ====${colors.reset}`);
    
    const percentage = Math.round((successful / total) * 100);
    let summaryColor = colors.red;
    let summaryMessage = 'Critical issues found!';
    
    if (percentage === 100) {
      summaryColor = colors.green;
      summaryMessage = 'All checks passed successfully!';
    } else if (percentage >= 75) {
      summaryColor = colors.yellow;
      summaryMessage = 'Some issues detected.';
    }
    
    console.log(`${summaryColor}${successful} of ${total} checks passed (${percentage}%) - ${summaryMessage}${colors.reset}`);
    
    console.log(`\n${colors.bright}Next steps:${colors.reset}`);
    if (percentage < 100) {
      console.log(`${colors.yellow}1. Check server logs in the Render dashboard${colors.reset}`);
      console.log(`${colors.yellow}2. Verify all environment variables are set correctly${colors.reset}`);
      console.log(`${colors.yellow}3. Ensure the build process completed successfully${colors.reset}`);
    } else {
      console.log(`${colors.green}1. Manually test key user flows${colors.reset}`);
      console.log(`${colors.green}2. Test with different device sizes${colors.reset}`);
      console.log(`${colors.green}3. Set up monitoring for your production app${colors.reset}`);
    }
    
    rl.close();
  }
  
  // Start verification
  urlsToTest.forEach(endpoint => checkEndpoint(endpoint));
}); 