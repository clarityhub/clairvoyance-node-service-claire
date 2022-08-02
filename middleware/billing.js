const { connect } = require('../services/pubsub');
const { verifyToken } = require('../helpers/tokens');
const { forbidden, paymentRequired } = require('../helpers/responses');
const logger = require('../helpers/logger');
const { COMMAND_BILLING_CREATE, COMMAND_BILLING_ADD_SEAT, COMMAND_BILLING_REMOVE_SEAT } = require('../events');

const exchange = `${process.env.NODE_ENV || 'development'}.billing`;

const connection = connect.then((c) => {
  return c.createChannel();
}).then((ch) => {
  ch.assertExchange(exchange, 'fanout', { durable: false });

  return ch;
}).catch(logger.error);

module.exports = (req, res, next) => {
  if (!req.services) {
    req.services = {};
  }

  req.services.billing = {
    create: (data) => {
      return connection.then((channel) => {
        channel.publish(exchange, '', Buffer.from(JSON.stringify({
          event: COMMAND_BILLING_CREATE,
          ts: +new Date(),
          meta: data,
        })));
      });
    },
    addSeat: (data) => {
      return connection.then((channel) => {
        channel.publish(exchange, '', Buffer.from(JSON.stringify({
          event: COMMAND_BILLING_ADD_SEAT,
          ts: +new Date(),
          meta: data,
        })));
      });
    },
    removeSeat: (data) => {
      return connection.then((channel) => {
        channel.publish(exchange, '', Buffer.from(JSON.stringify({
          event: COMMAND_BILLING_REMOVE_SEAT,
          ts: +new Date(),
          meta: data,
        })));
      });
    },
  };

  next();
};


module.exports.billingAccountMiddleware = (req, res, next) => {
  verifyToken(req.headers.token).then((decoded) => {
    if (!decoded.trialStatus) {
      // user is probably a client and should passthrough
      next();
    } else if (decoded.trialStatus &&
        (decoded.trialStatus.status !== 'trial' ||
        (decoded.trialStatus.status === 'trial' && !decoded.trialStatus.trialIsExpired))) {
      next();
    } else {
      paymentRequired(res)({
        reason: 'You must update your payment information to use this paid service',
      });
    }
  }).catch(() => {
    forbidden(res)({
      reason: 'The token provided is not valid',
    });
  });
};
