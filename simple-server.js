const http = require('http');
const fs = require('fs');
const path = require('path');

// Log Node.js version
console.log(`Running Node.js ${process.version}`);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types for common file extensions
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

// Create simple fallback HTML
const notFoundHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newspaper.AI</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; }
    .error { color: #ef4444; }
  </style>
</head>
<body>
  <h1>Newspaper.AI</h1>
  <p class="error">The requested page was not found.</p>
  <p>Please check the URL or return to the <a href="/">home page</a>.</p>
  <p>Server time: ${new Date().toISOString()}</p>
</body>
</html>
`;

// Check if dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  console.error(`ERROR: 'dist' directory not found at ${DIST_DIR}`);
  // Create minimal dist directory
  try {
    fs.mkdirSync(DIST_DIR, { recursive: true });
    const placeholderHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newspaper.AI</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; }
    p { line-height: 1.5; }
    .warning { color: #ca8a04; background: #fef9c3; padding: 1rem; border-radius: 0.5rem; }
  </style>
</head>
<body>
  <h1>Newspaper.AI</h1>
  <div class="warning">
    <p><strong>Application files not found.</strong></p>
    <p>The application's build files could not be located. If you're seeing this message, there may have been an issue with the build process.</p>
  </div>
  <p>Server time: ${new Date().toISOString()}</p>
</body>
</html>
    `;
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), placeholderHtml);
    console.log('Created placeholder index.html');
  } catch (err) {
    console.error(`Failed to create placeholder: ${err.message}`);
  }
}

// Create the HTTP server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Parse the URL and get the pathname
  let url = req.url;
  
  // Remove query parameters
  url = url.split('?')[0];
  
  // Default to index.html for root path
  if (url === '/' || url === '') {
    url = '/index.html';
  }
  
  // Get the file path
  const filePath = path.join(DIST_DIR, url);
  const extname = path.extname(filePath).toLowerCase();
  
  // Check if the file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log(`File not found: ${filePath}, serving index.html (SPA routing)`);
      
      // For SPA routing, serve index.html for paths that don't exist
      const indexPath = path.join(DIST_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        fs.readFile(indexPath, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Server Error');
            return;
          }
          
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        });
      } else {
        // If index.html doesn't exist, serve the fallback
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(notFoundHtml);
      }
      return;
    }
    
    // Get the content type based on the file extension
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // Set cache control headers
    let cacheControl = 'no-cache';
    if (url.includes('/assets/')) {
      cacheControl = 'public, max-age=31536000'; // 1 year for assets
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': cacheControl
      });
      res.end(data);
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving files from: ${DIST_DIR}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
}); 