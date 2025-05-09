// Absolute minimal server with zero dependencies
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log(`Starting minimal server, Node.js ${process.version}`);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Handle all HTTP requests
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Serve a simple HTML response
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Newspaper.AI</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .success { color: #10b981; }
      </style>
    </head>
    <body>
      <h1>Newspaper.AI</h1>
      <div class="card">
        <h2 class="success">Server Running Successfully!</h2>
        <p>The minimal server is working correctly. This is a temporary page while we address deployment issues.</p>
        <p>Server time: ${new Date().toISOString()}</p>
        <p>Node.js: ${process.version}</p>
      </div>
      <div class="card">
        <h3>About Newspaper.AI</h3>
        <p>An AI-powered news aggregator with personalized content delivery.</p>
        <p>Our platform combines TikTok-like consumption speed with AI-generated summaries and analysis of news articles, tailored to your interests.</p>
      </div>
    </body>
    </html>
  `);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
}); 