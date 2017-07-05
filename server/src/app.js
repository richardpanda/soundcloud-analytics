import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import routes from './routes';

const app = express();
const { LOGGING } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (LOGGING === 'true') {
  app.use(morgan('dev'));
}

app.use(routes);

export default app;
