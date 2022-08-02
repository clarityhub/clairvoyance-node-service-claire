let { btoa, atob } = global;

if (btoa === null || typeof btoa === 'undefined') {
  btoa = function (str) {
    return Buffer.from(str).toString('base64');
  };
}

if (atob === null || typeof atob === 'undefined') {
  atob = function (b64Encoded) {
    return Buffer.from(b64Encoded, 'base64').toString();
  };
}

const createForgery = (token) => {
  const parts = token.split('.');
  const base64Url = parts[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const data = JSON.parse(atob(base64));

  data.unsigned = 'unsigned data';

  const newData = btoa(unescape(encodeURIComponent(JSON.stringify(data))));

  return `${parts[0]}.${newData}.${parts[2]}`;
};

module.exports = {
  createForgery,
};
