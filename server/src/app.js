import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';

import routes from './routes';

const { LOGGING, SERVER_PORT } = process.env;
const app = express();

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
