/**
 * Minimal HTTP server for Newspaper.AI application
 * Uses only Node.js built-in modules for maximum compatibility
 */
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// Create a simple debug logger
const debug = {
  log: (...args) => console.log(`[${new Date().toISOString()}]`, ...args),
  error: (...args) => console.error(`[${new Date().toISOString()}] ERROR:`, ...args),
  warn: (...args) => console.warn(`[${new Date().toISOString()}] WARN:`, ...args),
  info: (...args) => console.info(`[${new Date().toISOString()}] INFO:`, ...args)
};

// Simple MIME type mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

/**
 * Create a fallback page if index.html is missing
 */
function createFallbackPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newspaper.AI</title>
  <style>
    body {
      font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
      background: #121212;
      color: #fff;
      line-height: 1.5;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .card {
      background: #1e1e1e;
      border-radius: 8px;
      padding: 2rem;
      margin: 2rem 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    h1 { color: #0ea5e9; margin-top: 0; }
    pre { background: #2a2a2a; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    .btn {
      display: inline-block;
      background: #0ea5e9;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Newspaper.AI</h1>
    <p>Our application is currently experiencing technical difficulties. We're working to resolve the issue.</p>
    <p>Server Time: ${new Date().toISOString()}</p>
    <p>Environment: ${NODE_ENV}</p>
    <p>Node Version: ${process.version}</p>
    <a href="/" class="btn">Refresh</a>
  </div>
</body>
</html>`;
}

/**
 * Send an HTTP response with the provided status, headers, and content
 */
function sendResponse(res, status, headers, content) {
  res.writeHead(status, headers);
  res.end(content);
}

/**
 * Send an error response with the provided status and message
 */
function sendError(res, status, message) {
  const errorPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error ${status} - Newspaper.AI</title>
  <style>
    body {
      font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
      background: #121212;
      color: #fff;
      line-height: 1.5;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .card {
      background: #1e1e1e;
      border-radius: 8px;
      padding: 2rem;
      margin: 2rem 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    h1 { color: #ef4444; margin-top: 0; }
    pre { background: #2a2a2a; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    .btn {
      display: inline-block;
      background: #0ea5e9;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Error ${status}</h1>
    <p>${message}</p>
    <pre>Server Time: ${new Date().toISOString()}</pre>
    <a href="/" class="btn">Back to Home</a>
  </div>
</body>
</html>`;

  res.writeHead(status, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(errorPage),
    'Cache-Control': 'no-cache'
  });
  res.end(errorPage);
}

// Log startup information
debug.info(`Starting server with Node.js ${process.version}`);
debug.info(`Environment: ${NODE_ENV}`);

// Prepare the dist directory path
const distDir = path.join(__dirname, 'dist');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  debug.warn(`'dist' directory not found at ${distDir}, creating it...`);
  try {
    // Create dist directory if it doesn't exist
    fs.mkdirSync(distDir, { recursive: true });
    
    // Create a basic index.html for testing
    const fallbackPage = createFallbackPage();
    fs.writeFileSync(path.join(distDir, 'index.html'), fallbackPage);
    debug.info('Created fallback index.html');
  } catch (err) {
    debug.error(`Failed to create dist directory: ${err.message}`);
    // Continue execution - we'll handle missing files in the request handler
  }
}

// List contents of dist directory for debugging
try {
  debug.info('Contents of dist directory:');
  const files = fs.readdirSync(distDir);
  if (files.length === 0) {
    debug.warn('dist directory is empty!');
  } else {
    files.forEach(file => debug.info(`- ${file}`));
    
    // Check for index.html specifically
    if (!files.includes('index.html')) {
      debug.warn('index.html not found in dist directory!');
    }
  }
} catch (err) {
  debug.error(`Error reading dist directory: ${err.message}`);
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  debug.error('UNCAUGHT EXCEPTION:', err);
  // Keep the server running despite uncaught exceptions
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  debug.error('UNHANDLED REJECTION:', reason);
});

// Create HTTP server with robust error handling
const server = http.createServer((req, res) => {
  try {
    // Log the request
    debug.log(`${req.method} ${req.url}`);
    
    // Parse the URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Normalize pathname
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    // Get file path
    let filePath = path.join(distDir, pathname);
    
    // Basic security check to prevent directory traversal
    if (!filePath.startsWith(distDir)) {
      return sendError(res, 403, "Forbidden");
    }
    
    // Get file extension for MIME type
    const ext = path.extname(filePath).toLowerCase();
    
    // Check if file exists and is readable
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        // If the file doesn't exist
        if (err.code === 'ENOENT') {
          // For SPA routing, serve index.html for all non-asset routes
          // Only if the request doesn't have a file extension (likely a route)
          if (!pathname.includes('.')) {
            const indexPath = path.join(distDir, 'index.html');
            
            fs.readFile(indexPath, (indexErr, indexContent) => {
              if (indexErr) {
                // If we can't read index.html, create a fallback page
                debug.error(`Error reading index.html: ${indexErr.message}`);
                const fallbackPage = createFallbackPage();
                return sendResponse(res, 200, {
                  'Content-Type': 'text/html',
                  'Content-Length': Buffer.byteLength(fallbackPage),
                  'Cache-Control': 'no-cache'
                }, fallbackPage);
              }
              
              // Serve index.html for SPA routing
              debug.info(`Serving index.html for SPA route: ${pathname}`);
              return sendResponse(res, 200, {
                'Content-Type': 'text/html',
                'Content-Length': indexContent.length,
                'Cache-Control': 'no-cache'
              }, indexContent);
            });
            return;
          }
          
          // For missing asset files, return 404
          debug.warn(`File not found: ${filePath}`);
          return sendError(res, 404, `File not found: ${pathname}`);
        }
        
        // For other file access errors
        debug.error(`File access error: ${err.message}`);
        return sendError(res, 500, "Server Error");
      }
      
      // Read the file
      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          debug.error(`Error reading file: ${readErr.message}`);
          return sendError(res, 500, "Error reading file");
        }
        
        // Set content type and caching headers
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const headers = {
          'Content-Type': contentType,
          'Content-Length': content.length
        };
        
        // Set cache control headers based on file type
        if (ext === '.html') {
          headers['Cache-Control'] = 'no-cache';
        } else if (pathname.startsWith('/assets/')) {
          headers['Cache-Control'] = 'public, max-age=31536000'; // 1 year
        }
        
        // Serve the file
        sendResponse(res, 200, headers, content);
      });
    });
  } catch (err) {
    // Catch any unexpected errors
    debug.error(`Unexpected error: ${err.message}`);
    debug.error(err.stack);
    sendError(res, 500, "Internal Server Error");
  }
});

// Start the server
server.listen(PORT, () => {
  debug.info(`Server running on port ${PORT}`);
  debug.info(`Serving files from: ${distDir}`);
  debug.info(`Server URL: http://localhost:${PORT}`);
});
