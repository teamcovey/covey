const crypto = require('crypto');

// Set keys file based on environment
const key = process.env.covey_env === 'PROD' || process.env.covey_env === 'DEV'
  ? require('../../config/keys.js').COOKIE_ENCRYPTION_KEY
  : require('../../config/keys.example.js').COOKIE_ENCRYPTION_KEY;

const cipher = crypto.createCipher('aes192', key);
const decipher = crypto.createDecipher('aes192', key);

exports.encryptValue = (value) => {
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

exports.decryptUserIdCookie = (request, response, next) => {
  try {
    let decrypted = decipher.update(request.cookies.user_id, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    /* eslint-disable */
    request.cookies.user_id = decrypted;
    request.params.userId = decrypted;
    /* eslint-enable */
  } catch (err) {
    /* eslint-disable */
    console.log('ERROR: Could not successfully decrypt cookie', err);
    /* eslint-enable */
  }
  next();
};
