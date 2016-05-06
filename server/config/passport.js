const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const keys = require('./keys.js');
const User = require('../models/user.js');
const Users = require('../collections/users.js');

passport.use(new Strategy(
  {
    clientID: keys.FB_CLIENT_ID,
    clientSecret: keys.FB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/facebook/return',
    profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'picture.type(large)'],
  },

  // TODO: handle refreshToken
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
              refreshToken,
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
