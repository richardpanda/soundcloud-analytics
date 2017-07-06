import app from './app';
import { postgresClient } from './clients';
import { Elasticsearch } from './utils';

const { SERVER_PORT } = process.env;

(async () => {
  try {
    await Promise.all([
      postgresClient.sync(),
      Elasticsearch.setUpIndexAndMapping(),
    ]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}.`);
  });
})();
