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

exports.decryptUserIdCookie = (request, response, next) => {
  const decipher = crypto.createDecipher('aes192', key);
  try {
    if (request.cookies.user_id !== undefined) {
      /* eslint-disable */
      var decrypted = decipher.update(request.cookies.user_id, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      request.cookies.user_id = decrypted;
      if (request.params) request.params.userId = decrypted;
      if (request.body) request.body.userId = decrypted;
      /* eslint-enable */
    }
  } catch (err) {
    /* eslint-disable */
    console.log('ERROR: Could not successfully decrypt cookie', err);
    /* eslint-enable */
  }
  next();
};
