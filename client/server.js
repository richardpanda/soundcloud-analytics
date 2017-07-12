const express = require('express');
const { join } = require('path');
const app = express();

const { CLIENT_SERVER_PORT } = process.env;

app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

console.log(CLIENT_SERVER_PORT);

app.listen(CLIENT_SERVER_PORT, () => {
  console.log(`Server is listening on port ${CLIENT_SERVER_PORT}.`);
});
