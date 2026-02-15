const express = require('express');
const path = require('path');

const app = express();
const PORT = 3200;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Fate & Feeling running at http://localhost:${PORT}`);
});
