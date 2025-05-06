const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any GET request that's not for a static file, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Application is available at: http://localhost:${PORT}`);
  console.log('When deployed to Render, it will be available at your Render URL');
}); 