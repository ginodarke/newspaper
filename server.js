const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Log Node.js version
console.log(`Running Node.js ${process.version}`);

// Enable compression
app.use(compression());

// Log middleware to help debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Check if dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.error(`ERROR: 'dist' directory not found at ${distDir}`);
  console.error('Make sure the build process completed successfully');
  
  // Create a minimal dist directory with a placeholder index.html
  try {
    fs.mkdirSync(distDir, { recursive: true });
    const placeholderHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Build Error</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
            .error { color: #e53e3e; }
            pre { background: #f7fafc; padding: 15px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1 class="error">Newspaper.AI - Build Error</h1>
          <p>The application build files were not found. This could indicate an issue with the build process.</p>
          <h2>Troubleshooting Steps:</h2>
          <ol>
            <li>Check the build logs in the Render dashboard</li>
            <li>Verify that all environment variables are correctly set</li>
            <li>Make sure all dependencies are installed</li>
            <li>Test the build process locally</li>
          </ol>
          <p>Server started at: ${new Date().toISOString()}</p>
          <p>Node.js version: ${process.version}</p>
        </body>
      </html>
    `;
    fs.writeFileSync(path.join(distDir, 'index.html'), placeholderHtml);
    console.log('Created placeholder index.html');
  } catch (err) {
    console.error(`Failed to create placeholder: ${err.message}`);
  }
}

// List contents of the dist directory to help with debugging
try {
  if (fs.existsSync(distDir)) {
    console.log('Contents of dist directory:');
    const files = fs.readdirSync(distDir);
    files.forEach(file => {
      const stats = fs.statSync(path.join(distDir, file));
      console.log(`- ${file} (${stats.isDirectory() ? 'directory' : stats.size + ' bytes'})`);
    });
  }
} catch (err) {
  console.error(`Error listing dist directory: ${err.message}`);
}

// Serve static files
app.use(express.static(distDir));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Server error: ${err.stack}`);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving files from: ${distDir}`);
}); 