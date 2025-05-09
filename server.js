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
  
  // Remove query parameters
  url = url.split('?')[0];
  
  // Ensure URL always starts with /
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  
  if (url === '/' || url === '') {
    url = '/index.html';
  }
  
  // Get file path
  const filePath = path.join(DIST_DIR, url);
  console.log(`Looking for file: ${filePath}`);
  
  // Handle static file requests
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log(`File not found: ${filePath}, serving index.html instead`);
      
      // For any path that doesn't exist, serve index.html (SPA behavior)
      const indexPath = path.join(DIST_DIR, 'index.html');
      
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          console.error(`Error reading index.html: ${err.message}`);
          res.writeHead(500);
          res.end('Internal Server Error');
          return;
        }
        
        // Set headers for HTML
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': data.length,
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff'
        });
        res.end(data);
      });
      return;
    }
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/plain';
    
    // Map file extension to content type
    switch (ext) {
      case '.html': contentType = 'text/html; charset=utf-8'; break;
      case '.css': contentType = 'text/css; charset=utf-8'; break;
      case '.js': contentType = 'application/javascript; charset=utf-8'; break;
      case '.json': contentType = 'application/json; charset=utf-8'; break;
      case '.png': contentType = 'image/png'; break;
      case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
      case '.gif': contentType = 'image/gif'; break;
      case '.svg': contentType = 'image/svg+xml'; break;
      case '.ico': contentType = 'image/x-icon'; break;
      case '.woff': contentType = 'font/woff'; break;
      case '.woff2': contentType = 'font/woff2'; break;
      case '.ttf': contentType = 'font/ttf'; break;
      case '.otf': contentType = 'font/otf'; break;
      case '.eot': contentType = 'application/vnd.ms-fontobject'; break;
    }
    
    console.log(`Serving file: ${filePath} as ${contentType}`);
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath}: ${err.message}`);
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
        'Cache-Control': cacheControl,
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(data);
    });
  });
});

// List files in the dist directory to verify they exist
console.log('Files in dist directory:');
try {
  const files = fs.readdirSync(DIST_DIR);
  files.forEach(file => {
    console.log(` - ${file}`);
    
    // If it's a directory, also list its contents
    const filePath = path.join(DIST_DIR, file);
    if (fs.statSync(filePath).isDirectory()) {
      const subFiles = fs.readdirSync(filePath);
      subFiles.forEach(subFile => {
        console.log(`   - ${file}/${subFile}`);
      });
    }
  });
} catch (err) {
  console.error(`Error listing dist directory: ${err.message}`);
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving files from: ${DIST_DIR}`);
}); 