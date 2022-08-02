const bugsnag = require('bugsnag');

const env = process.env.NODE_ENV;

let registered = false;

module.exports = {
  error(err) {
    if (env === 'development' || env === 'dev') {
      console.error(err);
    } else if (!registered) {
      console.error('Bugsnag is not setup');
      console.error(err);
    } else {
      bugsnag.notify(err, { severity: 'error' });
    }
  },

  warn(...args) {
    if (env === 'development' || env === 'dev') {
      console.warn(...args);
    } else if (!registered) {
      console.error('Bugsnag is not setup');
      console.warn(...args);
    } else {
      bugsnag.notify(args[0], { severity: 'warning' });
    }
  },

  log(...args) {
    if (env === 'development' || env === 'dev') {
      console.log(...args);
    }
  },

  register(id) {
    registered = true;
    bugsnag.register(id);
  },
};
