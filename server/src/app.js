import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';

import config from './config';
import routes from './routes';

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

export default app;
