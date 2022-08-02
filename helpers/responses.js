const ok = resp => (body) => {
  return resp.status(200).json(body);
};

/**
 * The request was malformed
 */
const badRequest = resp => ({ reason }) => {
  return resp.status(400).json({
    code: 'Bad Request',
    reason,
  });
};

/**
 * The request requires user authentication
 */
const unauthorized = resp => ({ reason }) => {
  return resp.status(401).json({
    code: 'Unauthorized',
    reason,
  });
};

/**
 * The server understood the request, but is refusing to fulfill it.
 */
const paymentRequired = resp => ({ reason }) => {
  return resp.status(402).json({
    code: 'Payment Required',
    reason,
  });
};

/**
 * The server understood the request, but is refusing to fulfill it.
 */
const forbidden = resp => ({ reason }) => {
  return resp.status(403).json({
    code: 'Forbidden',
    reason,
  });
};

/**
 * We are saying the entity could not be found (either becuase it
 * does not exist, or you do not have access to it
 */
const notFound = resp => () => {
  return resp.status(404).json({});
};

/**
 * The server encountered an unexpected condition which prevented it from fulfilling
 * the request
 */
const error = resp => (err, cleanReason) => {
  let cleanedReason = cleanReason || 'Something bad happened';

  if (process.env !== 'production') {
    cleanedReason = JSON.stringify(err.reason);
  }

  return resp.status(500).json({
    code: 'Internal Server Error',
    reason: cleanedReason,
  });
};

module.exports = {
  ok,
  badRequest,
  unauthorized,
  paymentRequired,
  forbidden,
  error,
  notFound,
};
