const call = require('../rpc/call');

module.exports = (req, res, next) => {
  if (!req.services) {
    req.services = {};
  }

  req.services.rpc = {
    call: (...args) => call.then(c => c(...args)),
  };

  next();
};
