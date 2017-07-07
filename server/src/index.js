import { scheduleJob } from 'node-schedule';

import app from './app';
import { postgresClient } from './clients';
import { Elasticsearch, Statistics } from './utils';

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

  scheduleJob('0 0 * * *', async () => {
    const errors = await Statistics.addNewStatistics();
    if (errors) {
      console.error(errors);
    }
  });

  app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}.`);
  });
})();
