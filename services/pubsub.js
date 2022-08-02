const pubsub = require('amqplib');
const { settings } = require('../helpers/config');
const logger = require('../helpers/logger');

const {
  host, port, password, username,
} = settings.pubsub;

if (!host || !port || !password || !username) {
  logger.error('Pubsub settings could not be found! A host, port, password, and username are required');
  process.exit();
}

const url = `amqp://${username}:${password}@${host}:${port}`;

const createConnection = (attempt = 0) => {
  logger.log(`Connecting to PubSub on ${host}:${port}; attempt ${attempt}`);
  // TODO reset attempt count if connection is successful at least once
  const connection = pubsub.connect(url).catch((e) => {
    logger.error(e);
    return new Promise((resolve, reject) => {
      if (attempt > 10) {
        return reject();
      }

      setTimeout(() => {
        createConnection(attempt + 1).then(resolve);
      }, (attempt + 1) * 10000);
    });
  });

  return connection;
};

const connect = createConnection();

const fanoutQueue = async (ex, queue, callback) => {
  const connection = await connect;
  const ch = await connection.createChannel();

  ch.assertExchange(ex, 'fanout', { durable: false });

  const q = await ch.assertQueue(queue, {});
  const ok = await ch.bindQueue(q.queue, ex, '');

  ch.consume(q.queue, (msg) => {
    const message = JSON.parse(msg.content.toString());

    callback(message);
  }, { noAck: true });

  return ok;
};

module.exports = {
  connect,
  createConnection,
  fanoutQueue,
};
