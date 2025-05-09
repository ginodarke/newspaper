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
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

h1 {
  color: #2563eb;
  margin-top: 0;
}

h2 {
  color: #4b5563;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
}

.error {
  color: #ef4444;
  padding: 0.5rem;
  background-color: #fee2e2;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.button {
  display: inline-block;
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.button:hover {
  background-color: #1d4ed8;
}

.placeholder {
  background-color: #f3f4f6;
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

.dark-mode {
  background-color: #111827;
  color: #f9fafb;
}

.dark-mode .container {
  background-color: #1f2937;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.dark-mode h1 {
  color: #3b82f6;
}

.dark-mode h2 {
  color: #d1d5db;
}

.dark-mode .card {
  border: 1px solid #374151;
  background-color: #1f2937;
}
`;

// Create a minimal JavaScript file
const jsContent = `
// Simple dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  document.getElementById('dark-mode-button').textContent = isDarkMode 
    ? 'Switch to Light Mode' 
    : 'Switch to Dark Mode';
}

// Check for saved preference
document.addEventListener('DOMContentLoaded', function() {
  const darkModeSaved = localStorage.getItem('darkMode') === 'true';
  if (darkModeSaved) {
    document.body.classList.add('dark-mode');
    document.getElementById('dark-mode-button').textContent = 'Switch to Light Mode';
  }
  
  // Add event listener to button
  document.getElementById('dark-mode-button').addEventListener('click', toggleDarkMode);
  
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
        <button id="dark-mode-button" class="button">Switch to Dark Mode</button>
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
        <h3>Why use Newspaper.AI?</h3>
        <p>Our platform combines TikTok-like consumption speed with AI-generated summaries and analysis of news articles, tailored to your interests.</p>
        <div class="placeholder large"></div>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
      </div>
    </div>
    
    <div id="news-page" class="page" style="display: none;">
      <h2>News</h2>
      <p>Your personalized news feed is currently unavailable.</p>
      
      <div class="card">
        <h3>Today's Headlines</h3>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder small"></div>
      </div>
      
      <div class="card">
        <h3>Trending Topics</h3>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder small"></div>
      </div>
    </div>
    
    <div id="profile-page" class="page" style="display: none;">
      <h2>Profile</h2>
      <p>User profile settings are currently unavailable.</p>
      
      <div class="card">
        <h3>Preferences</h3>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
      </div>
    </div>
    
    <div id="search-page" class="page" style="display: none;">
      <h2>Search</h2>
      <p>Search functionality is currently unavailable.</p>
      
      <div>
        <input type="text" placeholder="Search news..." style="padding: 0.5rem; width: 70%; border-radius: 4px; border: 1px solid #ccc; margin-right: 0.5rem;">
        <button class="button">Search</button>
      </div>
    </div>
    
    <footer style="margin-top: 2rem; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
      <p>&copy; 2025 Newspaper.AI - Last updated: <span id="footer-date"></span></p>
      <p>Note: This is a temporary placeholder while we address build issues with our application.</p>
    </footer>
  </div>
  <script src="/assets/index.js"></script>
</body>
</html>`;

// Write the files
try {
  fs.writeFileSync(path.join(assetsDir, 'index.css'), cssContent);
  console.log(`${colors.green}Created assets/index.css${colors.reset}`);
  
  fs.writeFileSync(path.join(assetsDir, 'index.js'), jsContent);
  console.log(`${colors.green}Created assets/index.js${colors.reset}`);
  
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
  console.log(`${colors.green}Created index.html${colors.reset}`);

  // Create minimal manifest file
  const manifestContent = JSON.stringify({
    name: "Newspaper.AI",
    short_name: "Newspaper.AI",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: []
  }, null, 2);
  
  fs.writeFileSync(path.join(distDir, 'manifest.json'), manifestContent);
  console.log(`${colors.green}Created manifest.json${colors.reset}`);
  
  // Create minimal robots.txt
  fs.writeFileSync(path.join(distDir, 'robots.txt'), "User-agent: *\nAllow: /");
  console.log(`${colors.green}Created robots.txt${colors.reset}`);
  
  console.log(`${colors.yellow}Fallback build completed successfully${colors.reset}`);
} catch (err) {
  console.error(`${colors.red}Error creating fallback files: ${err.message}${colors.reset}`);
  process.exit(1);
} 