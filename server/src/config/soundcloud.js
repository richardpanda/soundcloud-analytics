import { config } from 'dotenv';
config({ path: `${__dirname}/../../.env` });

export const clientId = process.env.NODE_ENV === 'test'
  ? '12345'
  : process.env.SOUNDCLOUD_CLIENT_ID;

export default {
  clientId,
};
