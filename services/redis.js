const Redis = require('redis');
const { settings } = require('../helpers/config');
const logger = require('../helpers/logger');

const {
  host, port, password, username,
} = settings.redis;

if (!host || !port) {
  logger.error('Redis settings could not be found! A host and port are required');
  process.exit();
}

const auth = (username ? `${username}:` : '') + (password || '');

const url = `redis://${auth}@${host}:${port}`;

const redis = Redis.createClient({
  url,
});

module.exports = redis;
