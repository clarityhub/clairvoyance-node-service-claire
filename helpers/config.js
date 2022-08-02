const path = require('path');

const settings = require(path.join(process.cwd(), 'settings.json'));

const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  settings: settings[env],
};
