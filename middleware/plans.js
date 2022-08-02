const { error, forbidden } = require('../helpers/responses');
const callPromise = require('../rpc/call');

const getPlan = ({ accountId }) => {
  const data = {
    req: 'plan',
    meta: {
      accountId,
    },
  };

  return callPromise.then(call => call('getPlan', data));
};

const getPlans = () => {
  const data = {
    req: 'plans',
    meta: {},
  };

  return callPromise.then(call => call('getPlans', data));
};

const planMiddleware = (req, res, next) => {
  // Get the plan for the given account
  const { accountId } = req.user;

  if (!accountId) {
    forbidden(res)({
      reason: 'You need an account to get your plan information',
    });
  }

  getPlan({ accountId }).then((plan) => {
    req.plan = plan;
    next();
  }).catch((e) => {
    // TODO log the error
    error(res)(e, 'Our systems are down, sorry about that');
  });
};

const plansMiddleware = (req, res, next) => {
  // Get all the plans
  getPlans().then((plans) => {
    req.plans = plans;
    next();
  }).catch((e) => {
    // TODO log the error
    error(res)(e, 'Our systems are down, sorry about that');
  });
};

module.exports = {
  planMiddleware,
  plansMiddleware,
};
