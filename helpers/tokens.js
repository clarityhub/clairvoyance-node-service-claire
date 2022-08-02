const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { settings } = require('./config');
const fs = require('fs');
const path = require('path');

let SECRET_KEY = settings.secret ?
  fs.readFileSync(path.join(process.cwd(), settings.secret)) :
  false;
let PUBLIC_KEY = settings.key ?
  fs.readFileSync(path.join(process.cwd(), settings.key)) :
  false;

const verify = promisify(jwt.verify);
const jwtOptions = { algorithm: 'RS256' };

if (process.env.NODE_ENV === 'test') {
  SECRET_KEY = '';
  PUBLIC_KEY = '';
  delete jwtOptions.algorithm;
}

// Default times
const REFRESH_TIME = /* 1 hour */ 60 * 60;
const EXP_TIME = /* 2 days */ 60 * 60 * 24 * 2;

const createToken = (data, refreshTime = REFRESH_TIME, expTime = EXP_TIME) => {
  if (SECRET_KEY === false) {
    throw new Error('Cannot create tokens!');
  }

  const now = Date.now();

  return jwt.sign(
    Object.assign(
      {},
      {
        refresh: Math.floor(now / 1000) + refreshTime,
      },
      data
    ),
    SECRET_KEY,
    Object.assign(
      {},
      jwtOptions,
      {
        expiresIn: expTime,
      }
    )
  );
};

const verifyToken = (token) => {
  const now = Math.floor((+new Date()) / 1000);
  const decoded = jwt.decode(token);

  if (!decoded) {
    return Promise.reject(new Error('No Valid Token'));
  }

  if (decoded.refresh > now && now < decoded.exp) {
    return verify(token, PUBLIC_KEY, jwtOptions);
  }

  return Promise.reject(new Error('Token must be refreshed!'));
};

module.exports = {
  createToken,
  verifyToken,
};
