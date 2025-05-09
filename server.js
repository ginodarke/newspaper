const http = require('http');
const path = require('path');
const fs = require('fs');

// Configuration
const PORT = process.env.PORT || 3000;

// Simple MIME type mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Log startup information
console.log(`Starting minimal server with Node.js ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Create very simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  try {
    // Normalize URL and set default to index.html for root
    let pathname = req.url;
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    // Get the file path
    const distDir = path.join(__dirname, 'dist');
    let filePath = path.join(distDir, pathname);

    // Basic security check to prevent directory traversal
    if (!filePath.startsWith(distDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // Get file extension
    const ext = path.extname(filePath);
    
    // Check if file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      // Read and serve the file
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } else {
      // For SPA routing, serve index.html for paths that don't exist as files
      // But only if they're not asset requests
      if (!pathname.includes('.')) {
        const indexPath = path.join(distDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        } else {
          res.writeHead(404);
          res.end('Not Found - index.html is missing');
        }
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// Check if dist directory exists and create it if not
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.warn(`WARNING: 'dist' directory not found at ${distDir}, creating it...`);
  try {
    fs.mkdirSync(distDir, { recursive: true });
    
    // Create a minimal index.html if the build is missing
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Newspaper.AI</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #121212; color: #fff; max-width: 800px; margin: 0 auto; padding: 20px; }
            .card { background: #1e1e1e; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #0ea5e9; }
            .button { background: #0ea5e9; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Newspaper.AI</h1>
            <p>The application files could not be found. This is a fallback page.</p>
            <p>Server time: ${new Date().toISOString()}</p>
          </div>
        </body>
      </html>
    `;
    fs.writeFileSync(path.join(distDir, 'index.html'), html);
    console.log('Created fallback index.html');
  } catch (err) {
    console.error(`ERROR: Failed to create dist directory: ${err.message}`);
  }
}

// List contents of dist directory for debugging
try {
  console.log('Contents of dist directory:');
  fs.readdirSync(distDir).forEach(file => {
    console.log(`- ${file}`);
  });
} catch (err) {
  console.error(`ERROR: Cannot read dist directory: ${err.message}`);
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving files from: ${distDir}`);
});
}); 