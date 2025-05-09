const path = require('path');
const compression = require('compression');

// Ensure we're using a compatible version of Node.js
const nodeVersion = process.version;
console.log(`Using Node.js version: ${nodeVersion}`);

// Try-catch block to provide better error handling
let express;
try {
  express = require('express');
} catch (err) {
  console.error('Error loading express:', err);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 10000;

// Compress all responses
app.use(compression());

// Cache control for static assets
app.use((req, res, next) => {
  // Add cache headers for static assets
  if (req.url.includes('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year for assets
  } else {
    res.setHeader('Cache-Control', 'no-cache'); // No cache for other resources
  }
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// For any request that doesn't match one above, send the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 