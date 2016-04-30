var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var userCheck = require('connect-ensure-login');

passport.use(new Strategy({
    //clientID: process.env.CLIENT_ID,
    //clientSecret: process.env.CLIENT_SECRET,
    clientID: '1304925519520920',
    clientSecret: 'c6ab5f1c5e9818ba2472fd1337506cfe',
    callbackURL: 'http://localhost:3000/login/facebook/return',
    profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'picture.type(large)']
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));