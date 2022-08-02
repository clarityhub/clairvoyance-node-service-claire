const helmet = require('helmet');

module.exports = () => helmet({
  hidePoweredBy: {
    setTo: 'Clarity Hub, Inc',
  },

  // Super script script policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      sandbox: ['allow-forms', 'allow-scripts'],
      reportUri: 'https://logs.clarityhub.io/report-violation',
      objectSrc: ["'none'"], // An empty array allows nothing through
    },
  },

  // Special Chrome header for Certificates after Oct 2017
  // TODO enable
  // expectCt: {
  //   enforce: true,
  //   maxAge: 30, // 30 seconds for now in case something goes wrong
  // XXX don't hard code this
  //   reportUri: 'https://logs.clarityhub.io/report-ct'
  // },

  // Testing the Chrome header:
  expectCt: {
    enforce: false,
    maxAge: 0,
    // XXX don't hard code this
    reportUri: 'https://logs.clarityhub.io/report-ct',
  },

  dnsPrefetchControl: {
    allow: false,
  },

  frameguard: {
    action: 'deny',
  },

  // Force HTTPS
  hsts: {
    maxAge: 5184000, // 60 days
  },

  ieNoOpen: {},

  noCache: {},

  noSniff: {},

  referrerPolicy: {
    policy: 'same-origin',
  },

  xssFilter: {
    setOnOldIE: true,
  },
});
