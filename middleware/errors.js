const logger = require('../helpers/logger');

// error handler
// no stacktraces leaked to user unless in development environment
/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.error(err);
  }

  res.status(err.status || 500);
  res.send({
    reason: err.message,
    error: (process.env.NODE_ENV !== 'production') ? err : {},
  });
};
/* eslint-enable no-unused-vars */
