const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const User = require('../models/user.js');
const Users = require('../collections/users.js');

// Set keys file based on environment
var keys = process.env.covey_env === 'PROD' || process.env.covey_env === 'DEV'
  ? require('./keys.js')
  : require('./keys.example.js');

// Set host based on environment
var callback;
if (process.env.covey_env === 'PROD') {
  callback = 'http://54.201.109.26/api/auth/facebook/return';
} else if (process.env.covey_env === 'DEV') {
  callback = 'http://54.201.109.26:3000/api/auth/facebook/return';
} else {
  callback = 'http://localhost:3000/api/auth/facebook/return';
}

passport.use(new Strategy(
  {
    clientID: keys.FB_CLIENT_ID,
    clientSecret: keys.FB_CLIENT_SECRET,
    callbackURL: callback,
    profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'picture.type(large)'],
  },
  (accessToken, refreshToken, profile, done) => {
    const facebookId = profile.id;
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    const email = profile.emails[0].value;
    const gender = profile.gender;
    const photoUrl = profile.photos[0].value;

    if (profile.id) {
      new User({ facebookId })
        .fetch()
        .then((found) => {
          if (found) {
            console.log('This facebook acount is already in the database!');
            done(null, found);
          } else {
            Users.create({
              facebookId,
              firstName,
              lastName,
              email,
              gender,
              photoUrl,
              accessToken,
              refreshToken,   // TODO: handle refreshToken
            })
            .then((user) => {
              console.log('Saving user...');
              done(null, user);
            })
            .catch((err) => {
              console.log('Error creating new user', err);
            });
          }
        });
    } else {
      console.log('Error: no facebookId');
    }
  }
));

passport.serializeUser((user, done) => {
  console.log('In serialzeUser');
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('In deserializeUser / id: ', id);
  User.where({ id })
  .fetch()
  .then((user) => {
    done(null, user);
  })
  .catch((err) => console.log('Error: ', err));
});

module.exports = passport;
