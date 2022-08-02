const { verifyToken } = require('../helpers/tokens');
const { forbidden } = require('../helpers/responses');
const callPromise = require('../rpc/call');

module.exports = (req, res, next) => {
  verifyToken(req.headers.token).then((decoded) => {
    if (decoded.userId) {
      req.user = decoded;
      next();
    } else {
      forbidden(res)({
        reason: 'You must be a full user',
      });
    }
  }).catch(() => {
    forbidden(res)({
      reason: 'The token provided is not valid',
    });
  });
};

module.exports.weakAuthMiddleware = (req, res, next) => {
  verifyToken(req.headers.token).then((decoded) => {
    if (decoded.userId || decoded.clientId) {
      req.user = decoded;
      next();
    } else {
      forbidden(res)({
        reason: 'You must be a full user or a client',
      });
    }
  }).catch(() => {
    forbidden(res)({
      reason: 'The token provided is not valid',
    });
  });
};

module.exports.isAdminMiddleware = (req, res, next) => {
  verifyToken(req.headers.token).then((decoded) => {
    if (decoded.privilege === 'admin') {
      req.user = decoded;
      next();
    } else {
      forbidden(res)({
        reason: 'You must be an admin to perform this action',
      });
    }
  }).catch(() => {
    forbidden(res)({
      reason: 'The token provided is not valid',
    });
  });
};


const getJwtFromAccessToken = (token, userUuid, scope) => {
  return callPromise.then(call => call('getJwtFromAccessToken', {
    token,
    userUuid,
    scope,
  }));
};

module.exports.integrationMiddleware = (scope = '') => {
  return (req, res, next) => {
    const accessToken = req.headers['access-token'];

    let asUser = false;
    let userUuid;
    if (req.query.asUser) {
      ({ asUser, userUuid } = req.query);
    }

    if (accessToken) {
      const requestedId = asUser ? userUuid : false;
      getJwtFromAccessToken(accessToken, requestedId, scope)
        .then(({ err, token, integrationUuid }) => {
          if (err) {
            forbidden(res)({
              reason: err,
            });
            return;
          }

          req.headers.token = token;
          req.integration = {
            uuid: integrationUuid,
          };
          next();
        }).catch(() => {
          forbidden(res)({
            reason: 'Invalid access token',
          });
        });
    } else {
      next();
    }
  };
};
