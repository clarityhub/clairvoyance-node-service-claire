const Sequelize = require('sequelize');
const { settings } = require('../helpers/config');
const logger = require('../helpers/logger');

const {
  database, username, password, host, dialect,
} = settings.database;
// XXX add port

if (!database || !username || !password || !host || !dialect) {
  logger.error('Could not connect to database. A database, username, password, host, and dialect are required');
  process.exit();
}

logger.log(`Connecting to ${dialect} (${database}) on ${host}`);

const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host,
    dialect,
    logging: false,
    retry: {
      max: 10,
      match: [
        Sequelize.ConnectionError,
      ],
    },
  }
);

module.exports = sequelize;
