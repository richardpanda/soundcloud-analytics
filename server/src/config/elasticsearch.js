const address = 'localhost';
const port = 9200;
const host = `${address}:${port}`;
const suffix = process.env.NODE_ENV;
const index = `soundcloud-analytics-${suffix}`;

module.exports = {
  host,
  index,
};
