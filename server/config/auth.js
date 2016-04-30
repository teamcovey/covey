const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const userCheck = require('connect-ensure-login');

passport.use(new Strategy(
  {
    // clientID: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,
    clientID: '1304925519520920',
    clientSecret: 'c6ab5f1c5e9818ba2472fd1337506cfe',
    callbackURL: 'http://localhost:3000/login/facebook/return',
    profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'picture.type(large)'],
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile)
));


// Serialize users into and deserialize users out of the session.
// TODO: change this to: supply the user ID when serializing, and querying the user record by ID
// from the database when deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});



