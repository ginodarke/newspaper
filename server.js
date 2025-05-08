const express = require('express');
const path = require('path');
const compression = require('compression');
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
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour for other resources
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