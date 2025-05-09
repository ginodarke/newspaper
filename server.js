const path = require('path');
const fs = require('fs');
const http = require('http');

// Log Node.js version
const nodeVersion = process.version;
console.log(`Using Node.js version: ${nodeVersion}`);

const PORT = process.env.PORT || 10000;
const DIST_DIR = path.join(__dirname, 'dist');

// Create a simple fallback HTML page
const FALLBACK_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newspaper.AI - Fallback Page</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; }
        pre { background: #f1f5f9; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .error { color: #ef4444; }
        .success { color: #10b981; }
    </style>
</head>
<body>
    <h1>Newspaper.AI - Server is Running</h1>
    <p>This is a fallback page indicating the server is working, but there might be issues with the main application.</p>
    
    <h2>Troubleshooting Information</h2>
    <p>Check the browser console for JavaScript errors.</p>
    
    <div id="diagnostics"></div>
    
    <script>
        // Simple diagnostics script
        const diagnostics = document.getElementById('diagnostics');
        
        function addInfo(message, type = '') {
            const p = document.createElement('p');
            p.textContent = message;
            if (type) p.className = type;
            diagnostics.appendChild(p);
        }
        
        // Add basic information
        addInfo('Browser: ' + navigator.userAgent);
        
        // Check if we can load a simple resource
        fetch('/manifest.json')
            .then(response => {
                if (response.ok) {
                    addInfo('✅ Successfully loaded manifest.json', 'success');
                    return response.json();
                } else {
                    addInfo('❌ Failed to load manifest.json: ' + response.status, 'error');
                    throw new Error('Failed to load manifest');
                }
            })
            .then(data => {
                addInfo('✅ Manifest loaded: ' + JSON.stringify(data), 'success');
            })
            .catch(err => {
                addInfo('❌ Error: ' + err.message, 'error');
            });
            
        // Try to load the main JS bundle
        fetch('/assets/index-Be-JfAoL.js')
            .then(response => {
                if (response.ok) {
                    addInfo('✅ Successfully loaded main JS bundle', 'success');
                } else {
                    addInfo('❌ Failed to load main JS bundle: ' + response.status, 'error');
                }
            })
            .catch(err => {
                addInfo('❌ Error loading main JS bundle: ' + err.message, 'error');
            });
    </script>
</body>
</html>
`;

// Simple HTTP server without Express
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Special route for diagnostics
  if (req.url === '/diagnostic.html') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(FALLBACK_HTML);
    return;
  }
  
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
      
      // Check if dist directory exists at all
      if (!fs.existsSync(DIST_DIR)) {
        console.error(`ERROR: dist directory does not exist at ${DIST_DIR}`);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<html><body>
          <h1>Server Error</h1>
          <p>The dist directory does not exist at ${DIST_DIR}.</p>
          <p>Please make sure the build was successful.</p>
          <p><a href="/diagnostic.html">View Diagnostic Page</a></p>
        </body></html>`);
        return;
      }
      
      // Check if index.html exists
      const indexPath = path.join(DIST_DIR, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.error(`ERROR: index.html does not exist at ${indexPath}`);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<html><body>
          <h1>Server Error</h1>
          <p>The index.html file does not exist at ${indexPath}.</p>
          <p>Please make sure the build was successful.</p>
          <p><a href="/diagnostic.html">View Diagnostic Page</a></p>
        </body></html>`);
        return;
      }
      
      // For any path that doesn't exist, serve index.html (SPA behavior)
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          console.error(`Error reading index.html: ${err.message}`);
          res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<html><body>
            <h1>Server Error</h1>
            <p>Error reading index.html: ${err.message}</p>
            <p><a href="/diagnostic.html">View Diagnostic Page</a></p>
          </body></html>`);
          return;
        }
        
        try {
          // Check if index.html is empty or too small (potential build issue)
          if (data.length < 100) {
            console.error(`ERROR: index.html is too small (${data.length} bytes)`);
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<html><body>
              <h1>Server Error</h1>
              <p>The index.html file is too small (${data.length} bytes).</p>
              <p>This indicates a potential build issue.</p>
              <p><a href="/diagnostic.html">View Diagnostic Page</a></p>
            </body></html>`);
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
        } catch (error) {
          console.error(`Error serving index.html: ${error.message}`);
          res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<html><body>
            <h1>Server Error</h1>
            <p>Error serving index.html: ${error.message}</p>
            <p><a href="/diagnostic.html">View Diagnostic Page</a></p>
          </body></html>`);
        }
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
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<html><body>
          <h1>Server Error</h1>
          <p>Error reading file ${filePath}: ${err.message}</p>
          <p><a href="/diagnostic.html">View Diagnostic Page</a></p>
        </body></html>`);
        return;
      }
      
      try {
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
      } catch (error) {
        console.error(`Error serving file ${filePath}: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<html><body>
          <h1>Server Error</h1>
          <p>Error serving file ${filePath}: ${error.message}</p>
          <p><a href="/diagnostic.html">View Diagnostic Page</a></p>
        </body></html>`);
      }
    });
  });
});

// List files in the dist directory to verify they exist
console.log('Files in dist directory:');
try {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`ERROR: dist directory does not exist at ${DIST_DIR}`);
  } else {
    const files = fs.readdirSync(DIST_DIR);
    if (files.length === 0) {
      console.error(`ERROR: dist directory is empty`);
    } else {
      files.forEach(file => {
        const filePath = path.join(DIST_DIR, file);
        const stats = fs.statSync(filePath);
        console.log(` - ${file} (${stats.size} bytes)`);
        
        // If it's a directory, also list its contents
        if (stats.isDirectory()) {
          try {
            const subFiles = fs.readdirSync(filePath);
            if (subFiles.length === 0) {
              console.log(`   * Directory is empty`);
            } else {
              subFiles.forEach(subFile => {
                const subFilePath = path.join(filePath, subFile);
                const subStats = fs.statSync(subFilePath);
                console.log(`   - ${file}/${subFile} (${subStats.size} bytes)`);
              });
            }
          } catch (err) {
            console.error(`   * Error reading directory ${file}: ${err.message}`);
          }
        }
      });
    }
  }
} catch (err) {
  console.error(`Error listing dist directory: ${err.message}`);
}

// Set up process error handling
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:');
  console.error(error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:');
  console.error(reason);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving files from: ${DIST_DIR}`);
  console.log(`Diagnostic page available at: http://localhost:${PORT}/diagnostic.html`);
}); 