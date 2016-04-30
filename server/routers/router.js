const app = require('../config/server-config.js');
const route = require('./router-helpers');

// can set up different routes for each path
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// authentication
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const userCheck = require('connect-ensure-login');

passport.use(new Strategy(
  {
    // clientID: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,
    clientID: '1304925519520920',
    clientSecret: 'c6ab5f1c5e9818ba2472fd1337506cfe',
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

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(morgan('dev'));

app.use(passport.initialize());

app.use(passport.session());

app.get('/', route.getUsage);

app.get('api/auth', route.getUser);

app.get('api/auth/facebook', passport.athenticate('facebook', { scope: ['email'] }));

app.get('api/auth/facebook/return',
	passport.authenticate('facebook', { failureRedirect: 'api/auth' }),
  (req, res) => res.redirect('/')
);

app.get('api/logout', (req, res) => {
  req.logout();
  req.session.destroy(() => res.redirect('/'));
});

app.get('/api/coveys', userCheck.ensureLoggedIn('/api/auth'), route.getAllCoveys);

app.post('/api/coveys', userCheck.ensureLoggedIn('/api/auth'), route.addCovey);

app.delete('/api/coveys/:id', userCheck.ensureLoggedIn('/api/auth'), route.removeCovey);

app.put('/api/coveys/:id', userCheck.ensureLoggedIn('/api/auth'), route.updateCovey);

app.get('/api/coveys/:id', userCheck.ensureLoggedIn('/api/auth'), route.getCovey);

app.post('/api/signup', route.signup);

app.delete('/api/removeuser', route.removeUser);

module.exports = app;
