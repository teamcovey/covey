const crypto = require('crypto');

// Set keys file based on environment
const key = process.env.covey_env === 'PROD' || process.env.covey_env === 'DEV'
  ? require('../../config/keys.js').COOKIE_ENCRYPTION_KEY
  : require('../../config/keys.example.js').COOKIE_ENCRYPTION_KEY;

exports.encryptValue = (value) => {
  const cipher = crypto.createCipher('aes192', key);
  /* eslint-disable */
  var encrypted = cipher.update(value, 'utf8', 'hex');
  /* eslint-enable */
  encrypted += cipher.final('hex');
  return encrypted;
};

exports.decryptUserId = (request, response, next) => {
  try {
    if (request.cookies.user_id) {
      const decipher = crypto.createDecipher('aes192', key);
      /* eslint-disable */
      var decrypted = decipher.update(request.cookies.user_id, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      request.cookies.user_id = decrypted;
      /* eslint-enable */
    }
    if (request.params && request.params.userId) {
      const decipher = crypto.createDecipher('aes192', key);
      /* eslint-disable */
      var decrypted = decipher.update(request.params.userId, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      request.params.userId = decrypted;
      /* eslint-enable */
    }
    if (request.body && request.body.userId) {
      const decipher = crypto.createDecipher('aes192', key);
      /* eslint-disable */
      var decrypted = decipher.update(request.body.userId, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      request.body.userId = decrypted;
      /* eslint-enable */
    }
    next();
  } catch (err) {
    /* eslint-disable */
    console.log('ERROR: Could not successfully decrypt cookie', err);
    /* eslint-enable */
    response.status(401).send();
  }
};
