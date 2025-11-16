const crypto = require('crypto');

const generateSignature = (params, passphrase = '') => {
  const sorted = Object.entries(params)
    .filter(([_, v]) => v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  const stringToHash = passphrase ? `${sorted}&passphrase=${passphrase}` : sorted;
  return crypto.createHash('md5').update(stringToHash).digest('hex');
};

module.exports = { generateSignature };