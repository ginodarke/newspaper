const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const PORT = process.env.PORT || 10000;

// Compress all responses
app.use(compression());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// For any request that doesn't match one above, send the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 