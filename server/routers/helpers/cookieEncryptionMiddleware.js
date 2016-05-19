const crypto = require('crypto');

/*eslint-disable*/
// Set keys file based on environment. Keys.example.js is used in the travis-ci build
const key = process.env.covey_env === 'PROD'
  || process.env.covey_env === 'DEV'
  || process.env.covey_env === 'LOCAL'
  ? require('../../config/keys.js').COOKIE_ENCRYPTION_KEY
  : require('../../config/keys.example.js').COOKIE_ENCRYPTION_KEY;
  /*eslint-enable*/

// Encrypts any value using the COOKIE_ENCRY{TION_KEY}
exports.encryptValue = (value) => {
  const cipher = crypto.createCipher('aes192', key);
  /* eslint-disable */
  var encrypted = cipher.update(value, 'utf8', 'hex');
  /* eslint-enable */
  encrypted += cipher.final('hex');
  return encrypted;
};

/* eslint-disable */
exports.decryptUserId = (request, response, next) => {

  /*
   * Will attempt to decrypt cookie, params, and request body
   * If unsuccessful, will respond with 401.
   */
  try {
    /* 
     * Decrypts user id from the cookie. Unlike the params and body (below),
     * We do not check whether the user id cookie is undefined. If the cookie
     * does not exist, we want the decryption function to throw an error, thereby causing the 
     * server to respond with a 401 in the (see 'catch' block below).
     */
    const decipherCookie = crypto.createDecipher('aes192', key);
    var decrypted = decipherCookie.update(request.cookies.userId, 'hex', 'utf8');
    decrypted += decipherCookie.final('utf8');
    request.cookies.userId = decrypted;

    // Decrypts user id from request parameters, if they exist
    if (request.params && request.params.userId !== undefined) {
      const decipherParam = crypto.createDecipher('aes192', key);
      var decrypted = decipherParam.update(request.params.userId, 'hex', 'utf8');
      decrypted += decipherParam.final('utf8');
      request.params.userId = decrypted;
    }

    // Decrypts user id from request body, if it exists
    if (request.body && request.body.userId !== undefined) {
      const decipherBody = crypto.createDecipher('aes192', key);
      var decrypted = decipherBody.update(request.body.userId, 'hex', 'utf8');
      decrypted += decipherBody.final('utf8');
      request.body.userId = decrypted;
    }
    next();
  } catch (err) {
    /*
     * If there is an error during the param/body decryption process,
     * then the client is sent a 401/Unauthorized
     */
    response.status(401).send();
  }
};
/* eslint-enable */
