const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
let keys;
if (process.env.COVEYENV === 'PROD') {
  keys = require('./keys.js');
}

passport.use(new Strategy(
  {
    // clientID: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,
    clientID: keys.FB_CLIENT_ID,
    clientSecret: keys.FB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/facebook/return',
    profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'picture.type(large)'],
  },
  // TODO: Once db available, hook-up accessToken <-> user here
  (accessToken, refreshToken, profile, cb) => cb(null, profile)
));

// Serialize users into and deserialize users out of the session.
// TODO: change this to: supply the user ID when serializing,
// and querying the user record by ID from the database when deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

module.exports = passport;
