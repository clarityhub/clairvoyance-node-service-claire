const { connect } = require('../services/pubsub');

const prefix = `${process.env.NODE_ENV || 'development'}.rpc.`;

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

const call = async () => {
  const consumers = {

  };

  const channel = await connect.then(c => c.createChannel());
  const queue = await channel.assertQueue('', { exclusive: true });
  channel.consume(queue.queue, (msg) => {
    Object.values(consumers).forEach((c) => {
      c(msg);
    });
  }, { noAck: true });

  return (queueName, data, timeout = 2000) => {
    return new Promise((resolve, reject) => {
      const corr = generateUuid();

      try {
        const timer = setTimeout(() => {
          reject(new Error({ reason: 'Timeout' }));
        }, timeout);

        consumers[corr] = (msg) => {
          if (msg.properties.correlationId === corr) {
            delete consumers[corr];
            clearTimeout(timer);
            resolve(JSON.parse(msg.content.toString()));
          }
        };

        channel.sendToQueue(
          prefix + queueName,
          Buffer.from(JSON.stringify(data)),
          {
            correlationId: corr,
            replyTo: queue.queue,
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  };
};

module.exports = call();
