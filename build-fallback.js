#!/usr/bin/env node

/**
 * This is a fallback build script that creates a minimal static site
 * if the regular Vite build fails. It generates HTML, CSS, and JS placeholders
 * that at least allow the app to load and display a message to users.
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for terminal
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`${colors.yellow}Starting fallback build script${colors.reset}`);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

try {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log(`${colors.green}Created dist directory${colors.reset}`);
  }
  
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log(`${colors.green}Created assets directory${colors.reset}`);
  }
} catch (err) {
  console.error(`${colors.red}Error creating directories: ${err.message}${colors.reset}`);
  process.exit(1);
}

// Create a minimal CSS file
const cssContent = `
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #121212;
  color: #f0f0f0;
  line-height: 1.6;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-top: 2rem;
}

h1 {
  color: #0ea5e9;
  margin-top: 0;
}

h2 {
  color: #94a3b8;
}

.card {
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #262626;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateZ(10px);
}

.error {
  color: #ef4444;
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
}

.button {
  display: inline-block;
  background-color: #0ea5e9;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  transform: translateZ(5px);
}

.button:hover {
  background-color: #0284c7;
  transform: translateZ(10px);
}

.placeholder {
  background-color: #2e2e2e;
  height: 1.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  width: 100%;
  animation: pulse 2s infinite;
}

.placeholder.large {
  height: 2rem;
}

.placeholder.small {
  height: 1rem;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}

.light-mode {
  background-color: #f5f5f5;
  color: #333;
}

.light-mode .container {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.light-mode h1 {
  color: #0ea5e9;
}

.light-mode h2 {
  color: #4b5563;
}

.light-mode .card {
  border: 1px solid #e5e7eb;
  background-color: white;
}
`;

// Create a minimal JavaScript file
const jsContent = `
// Simple dark/light mode toggle
function toggleLightMode() {
  document.body.classList.toggle('light-mode');
  const isLightMode = document.body.classList.contains('light-mode');
  localStorage.setItem('lightMode', isLightMode ? 'true' : 'false');
  document.getElementById('theme-button').textContent = isLightMode 
    ? 'Switch to Dark Mode' 
    : 'Switch to Light Mode';
}

// Check for saved preference
document.addEventListener('DOMContentLoaded', function() {
  const lightModeSaved = localStorage.getItem('lightMode') === 'true';
  if (lightModeSaved) {
    document.body.classList.add('light-mode');
    document.getElementById('theme-button').textContent = 'Switch to Dark Mode';
  }
  
  // Add event listener to button
  document.getElementById('theme-button').addEventListener('click', toggleLightMode);
  
  // Add current date to footer
  const footer = document.getElementById('footer-date');
  if (footer) {
    footer.textContent = new Date().toLocaleDateString();
  }
});

// Simple SPA navigation
window.handleNavigation = function(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
  });
  
  // Show selected page
  const selectedPage = document.getElementById(page);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  } else {
    document.getElementById('home-page').style.display = 'block';
  }
  
  // Update URL without page reload
  history.pushState(null, null, '/' + (page === 'home-page' ? '' : page.replace('-page', '')));
}

// Handle back/forward navigation
window.addEventListener('popstate', function() {
  const path = window.location.pathname;
  const page = path === '/' ? 'home-page' : path.substring(1) + '-page';
  handleNavigation(page);
});

// Initial page load
window.addEventListener('load', function() {
  const path = window.location.pathname;
  const page = path === '/' ? 'home-page' : path.substring(1) + '-page';
  handleNavigation(page);
});
`;

// Create a basic HTML file with app shell
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newspaper.AI - News Aggregator</title>
  <meta name="description" content="AI-powered news aggregator with personalized content delivery">
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Newspaper.AI</h1>
      <p>AI-powered news aggregator with personalized content delivery</p>
      <div>
        <button id="theme-button" class="button">Switch to Light Mode</button>
      </div>
      <nav style="margin-top: 1rem;">
        <button class="button" onclick="handleNavigation('home-page')">Home</button>
        <button class="button" onclick="handleNavigation('news-page')">News</button>
        <button class="button" onclick="handleNavigation('profile-page')">Profile</button>
        <button class="button" onclick="handleNavigation('search-page')">Search</button>
      </nav>
    </header>
    
    <div id="home-page" class="page">
      <h2>Welcome to Newspaper.AI</h2>
      <p>We're currently experiencing some technical difficulties with our full application. 
      Our team is working hard to restore full functionality as soon as possible.</p>
      
      <div class="card">
        <h3>Maintenance Notice</h3>
        <p>The Newspaper.AI application is currently undergoing maintenance to improve performance and stability.</p>
        <p>Please check back later for the full experience.</p>
      </div>
      
      <div class="card">
        <h3>Project Overview</h3>
        <p>Newspaper.AI combines TikTok-like consumption speed with AI-generated summaries and analysis of news articles, tailored to each user.</p>
      </div>
    </div>
    
    <div id="news-page" class="page" style="display: none;">
      <h2>News Feed</h2>
      <p>The news feed is currently unavailable during maintenance.</p>
      
      <div class="card">
        <div class="placeholder large"></div>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder small"></div>
      </div>
      
      <div class="card">
        <div class="placeholder large"></div>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder small"></div>
      </div>
    </div>
    
    <div id="profile-page" class="page" style="display: none;">
      <h2>User Profile</h2>
      <p>Profile management is currently unavailable during maintenance.</p>
      
      <div class="card">
        <div class="placeholder large"></div>
        <div class="placeholder"></div>
        <div class="placeholder small"></div>
      </div>
    </div>
    
    <div id="search-page" class="page" style="display: none;">
      <h2>Search</h2>
      <p>Search functionality is currently unavailable during maintenance.</p>
      
      <div class="card">
        <div class="placeholder"></div>
        <div class="placeholder small"></div>
      </div>
    </div>
    
    <footer style="margin-top: 2rem; text-align: center;">
      <p>© 2025 Newspaper.AI - Current Date: <span id="footer-date"></span></p>
      <p>This is a maintenance page. The full application will be restored soon.</p>
    </footer>
  </div>
  
  <script src="/assets/index.js"></script>
</body>
</html>`;

try {
  // Write the CSS file
  fs.writeFileSync(path.join(assetsDir, 'index.css'), cssContent);
  console.log(`${colors.green}Created CSS file${colors.reset}`);
  
  // Write the JS file
  fs.writeFileSync(path.join(assetsDir, 'index.js'), jsContent);
  console.log(`${colors.green}Created JS file${colors.reset}`);
  
  // Write the HTML file
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
  console.log(`${colors.green}Created HTML file${colors.reset}`);
  
  console.log(`${colors.green}Fallback build completed successfully${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}Error creating files: ${err.message}${colors.reset}`);
  process.exit(1);
}

// Make the file executable
try {
  fs.chmodSync(__filename, '755');
} catch (err) {
  console.error(`${colors.yellow}Warning: Could not make script executable: ${err.message}${colors.reset}`);
} 