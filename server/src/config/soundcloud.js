require("dotenv").config({ path: `${__dirname}/../../.env` });

const clientId = process.env.NODE_ENV === 'test'
  ? '12345'
  : process.env.SOUNDCLOUD_CLIENT_ID;

module.exports = {
  clientId,
};
