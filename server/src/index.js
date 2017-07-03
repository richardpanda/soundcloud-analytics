import logger from 'morgan';

import app from './app';
import { postgresClient } from './clients';
import { Elasticsearch } from './utils';

const { SERVER_PORT } = process.env;

postgresClient.sync();
Elasticsearch.setUpIndexAndMapping();

app.use(logger('dev'));

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port ${SERVER_PORT}.`);
});
