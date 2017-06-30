import Sequelize from 'sequelize';

const {
  LOGGING,
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_TIMEZONE,
  POSTGRES_USERNAME,
} = process.env;
const logging = LOGGING === 'true'
  ? console.log
  : false;
const sequelize = new Sequelize(POSTGRES_DATABASE, POSTGRES_USERNAME, POSTGRES_PASSWORD, {
  dialect: 'postgres',
  host: POSTGRES_HOST,
  logging,
});

export default sequelize;
