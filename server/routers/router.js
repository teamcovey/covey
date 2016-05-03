const app = require('../config/server-config.js');
const route = require('./router-helpers');

// can set up different routes for each path
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Authentication
const passport = require('../config/passport.js');
const auth = require('connect-ensure-login').ensureLoggedIn('/api/auth');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Initialize
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

// Routes: app
app.get('/', route.getUsage);

app.get('/api/user', auth, route.getUser);

app.get('/api/coveys', auth, route.getAllCoveys);

app.post('/api/coveys', auth, route.addCovey);

app.delete('/api/coveys/:id', auth, route.removeCovey);

app.put('/api/coveys/:id', auth, route.updateCovey);

app.get('/api/coveys/:id', auth, route.getCovey);

app.post('/api/signup', route.signup);

app.delete('/api/removeuser', route.removeUser);

// Routes: authentication
app.get('/api/auth', route.login);

app.get('/api/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/api/auth/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/api/auth' }),
  (req, res) => res.redirect('/')
);

app.get('/api/logout',
  (req, res) => {
    req.logout();
    req.session.destroy(() => res.redirect('/'));
  }
);

module.exports = app;
