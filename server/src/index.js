import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';

import { postgresClient } from './clients';
import routes from './routes';
import { Elasticsearch } from './utils';

const { LOGGING, SERVER_PORT, SET_UP_ELASTICSEARCH } = process.env;
const app = express();

postgresClient.sync();

if (SET_UP_ELASTICSEARCH === 'true') {
  Elasticsearch.setUpIndexAndMapping();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (LOGGING === 'true') {
  app.use(logger('dev'));
}

app.use(routes);

app.listen(SERVER_PORT, () => {
  if (LOGGING === 'true') {
    console.log(`Listening on port ${SERVER_PORT}.`);
  }
});

export default app;
