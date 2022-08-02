const { connect } = require('../services/pubsub');

const prefix = `${process.env.NODE_ENV || 'development'}.rpc.`;

const connections = {};

const subscribe = async (queueName, handler) => {
  const connection = await connect;
  const channel = await connection.createChannel();
  connections[queueName] = channel;

  channel.assertQueue(prefix + queueName, { durable: false });
  channel.prefetch(1);
  channel.consume(prefix + queueName, (msg) => {
    const result = handler(JSON.parse(msg.content.toString()));

    Promise.resolve(result).then((data) => {
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(data)),
        { correlationId: msg.properties.correlationId }
      );

      channel.ack(msg);
    });
  });
};

const unsubscribe = (queueName) => {
  connections[queueName].close();
  delete connections[queueName];
};

module.exports = {
  subscribe,
  unsubscribe,
};
