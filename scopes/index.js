const SCOPES = {
  ALL: 'all',
  USER_READ: 'user:read',
  SUGGEST_CREATE: 'suggest:create',
  MESSAGE_COMPOSE: 'message:compose',
  MESSAGE_CREATE: 'message:create',
  MESSAGE_READ: 'message:read',
};

module.exports = SCOPES;

/**
 * Can the {givenScope} access {checkScope}
 */
module.exports.can = (givenScope, checkScope) => {
  if (givenScope === SCOPES.ALL) {
    return true;
  }

  const scopes = givenScope.split(',');

  const can = scopes.map((scope) => {
    return checkScope === scope;
  }).reduce((a, b) => {
    return a || b;
  }, false);

  return can;
};
