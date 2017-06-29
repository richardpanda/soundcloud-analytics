import elasticsearch from 'elasticsearch';

import config from '../config';

const { host, log } = config.elasticsearch;
const elasticsearchClient = elasticsearch.Client({
  host,
  log,
});

export default elasticsearchClient;
