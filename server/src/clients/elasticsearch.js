import { Client } from 'elasticsearch';

const { ELASTICSEARCH_ADDRESS, ELASTICSEARCH_PORT, LOGGING } = process.env;
const host = `${ELASTICSEARCH_ADDRESS}:${ELASTICSEARCH_PORT}`;
const log = LOGGING === 'true'
  ? 'trace'
  : '';

export default Client({
  host,
  log,
});
