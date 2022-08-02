const { ok } = require('../helpers/responses');

module.exports = (services = []) => (req, res) => {
  // ...
  const promises = [];

  services.forEach((s) => {
    if (s.authenticate) {
      promises.push(s.authenticate());
    }
  });

  if (promises.length > 0) {
    return Promise.all(promises).then(() => {
      return ok(res)({});
    });
  }
  return ok(res)({
    status: '200',
    reason: 'All good!',
  });
};
