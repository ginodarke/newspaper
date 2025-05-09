const path = require('path');
const fs = require('fs');
const http = require('http');

// Log Node.js version
const nodeVersion = process.version;
console.log(`Using Node.js version: ${nodeVersion}`);

const PORT = process.env.PORT || 10000;
const DIST_DIR = path.join(__dirname, 'dist');

// Simple HTTP server without Express
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Handle root or no path requests
  let url = req.url;
  if (url === '/' || url === '') {
    url = '/index.html';
  }
  
  // Get file path
  const filePath = path.join(DIST_DIR, url);
  
  // Handle static file requests
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // For any path that doesn't exist, serve index.html (SPA behavior)
      const indexPath = path.join(DIST_DIR, 'index.html');
      
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Internal Server Error');
          return;
        }
        
        // Set headers for HTML
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Content-Length': data.length,
          'Cache-Control': 'no-cache'
        });
        res.end(data);
      });
      return;
    }
    
    // Get file extension
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    
    // Map file extension to content type
    switch (ext) {
      case '.html': contentType = 'text/html'; break;
      case '.css': contentType = 'text/css'; break;
      case '.js': contentType = 'application/javascript'; break;
      case '.json': contentType = 'application/json'; break;
      case '.png': contentType = 'image/png'; break;
      case '.jpg': contentType = 'image/jpeg'; break;
      case '.svg': contentType = 'image/svg+xml'; break;
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      
      // Set appropriate cache headers
      let cacheControl = 'no-cache';
      if (url.includes('/assets/')) {
        cacheControl = 'public, max-age=31536000'; // 1 year for assets
      }
      
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': data.length,
        'Cache-Control': cacheControl
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 