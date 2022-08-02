const { COMMAND_EMAIL_SEND } = require('../events');
const { connect } = require('../services/pubsub');
const logger = require('../helpers/logger');

const exchange = `${process.env.NODE_ENV || 'development'}.email`;

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

  req.services.email = {
    send: (data) => {
      return connection.then((channel) => {
        channel.publish(exchange, '', Buffer.from(JSON.stringify({
          event: COMMAND_EMAIL_SEND,
          ts: +new Date(),
          meta: data,
        })));
      });
    },
  };

  next();
};
