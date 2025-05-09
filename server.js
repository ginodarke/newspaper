const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// MIME types for different file extensions
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
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Log system info
console.log(`Running Node.js ${process.version}`);
console.log(`Environment: ${NODE_ENV}`);

// Create server
const server = http.createServer((req, res) => {
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Parse URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Normalize pathname
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }
  
  // Get file path
  const distDir = path.join(__dirname, 'dist');
  let filePath = path.join(distDir, pathname);
  
  // Handle special case for root URL
  if (pathname === '/') {
    filePath = path.join(distDir, 'index.html');
  }
  
  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Get content type based on file extension
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Try to read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // If file doesn't exist and it's not an asset, serve index.html for SPA routing
        if (!pathname.startsWith('/assets/')) {
          // For SPA routing, serve index.html for paths that are not files
          fs.readFile(path.join(distDir, 'index.html'), (err, data) => {
            if (err) {
              res.writeHead(500);
              res.end('Error loading index.html');
              return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data, 'utf-8');
          });
        } else {
          // For missing assets, return 404
          res.writeHead(404);
          res.end('File not found');
        }
      } else {
        // Other server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Set cache headers based on file type
      const headers = { 'Content-Type': contentType };
      
      if (pathname.endsWith('.html')) {
        headers['Cache-Control'] = 'no-cache';
      } else if (pathname.startsWith('/assets/')) {
        headers['Cache-Control'] = 'public, max-age=31536000';
      }
      
      // Serve file
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

// Check if dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.error(`ERROR: 'dist' directory not found at ${distDir}`);
  // Create a minimal dist directory with a placeholder index.html
  try {
    fs.mkdirSync(distDir, { recursive: true });
    const placeholderHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Newspaper.AI</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h1>Newspaper.AI</h1>
          <p class="error">The application files could not be found. Please check server logs.</p>
          <p>Server time: ${new Date().toISOString()}</p>
        </body>
      </html>
    `;
    fs.writeFileSync(path.join(distDir, 'index.html'), placeholderHtml);
    console.log('Created placeholder index.html');
  } catch (err) {
    console.error(`Failed to create placeholder: ${err.message}`);
  }
}

// List files in dist directory to debug
try {
  console.log('Contents of dist directory:');
  const files = fs.readdirSync(distDir);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
  
  // Check for index.html specifically
  if (!files.includes('index.html')) {
    console.error('WARNING: index.html not found in dist directory!');
  }
} catch (err) {
  console.error(`Error reading dist directory: ${err.message}`);
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving files from: ${distDir}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
}); 