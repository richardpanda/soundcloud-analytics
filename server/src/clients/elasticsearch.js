const elasticsearch = require('elasticsearch');

const config = require('../config');

const { host, log } = config.elasticsearch;
const elasticsearchClient = elasticsearch.Client({
  host,
  log,
});

module.exports = elasticsearchClient;
