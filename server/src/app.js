const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(4000, () => {
  console.log('Listening on port 4000.');
});

module.exports = app;
