const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'home.html'));
});
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'search.html'));
});
app.get('/detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'detail.html'));
});

app.listen(PORT, () => {
  console.log(`The client service runs on http://localhost:${PORT}`);
  console.log('Please ensure that the API service has been started (http://localhost:3000)');
});