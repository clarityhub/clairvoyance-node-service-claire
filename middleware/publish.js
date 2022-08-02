const pubsub = require('../services/pubsub');

const publishMiddleware = configure => (req, res, next) => {
  if (req.services) {
    req.services.publish = configure(pubsub.connect);
  } else {
    req.services = {
      publish: configure(pubsub.connect),
    };
  }

  next();
};

module.exports = publishMiddleware;
