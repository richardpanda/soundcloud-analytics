const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');

const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(routes);

app.listen(config.server.port, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Listening on port ${config.server.port}.`);
  }
});

module.exports = app;
