const { error, forbidden } = require('../helpers/responses');
const callPromise = require('../rpc/call');

const getFullUser = ({ userId, clientId }) => {
  const data = {
    req: 'user',
    meta: {
      userId,
      clientId,
    },
  };

  return callPromise.then(call => call('getUser', data));
};

const fullUserMiddleware = (req, res, next) => {
  const { userId, clientId } = req.user;

  if (userId || clientId) {
    getFullUser({ userId, clientId }).then((user) => {
      req.user = Object.assign({}, req.user, user);
      next();
    }).catch((e) => {
      // TODO log the error
      error(res)(e, 'Our systems are down, sorry about that');
    });
  } else {
    forbidden(res)({
      reason: 'You must be a full user or a client',
    });
  }
};


module.exports = {
  fullUserMiddleware,
};
