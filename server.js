const express = require('express');
const path = require('path');
const fs = require('fs');

// Don't use compression which indirectly requires iconv-lite
const app = express();
const PORT = process.env.PORT || 3000;

// Log Node.js version
console.log(`Running Node.js ${process.version}`);

// Log middleware to help debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
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

// Serve static files directly without compression
app.use(express.static(distDir, {
  etag: true,
  lastModified: true,
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Simple SPA routing - handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving files from: ${distDir}`);
}); 