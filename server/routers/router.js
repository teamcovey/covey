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

app.post('/api/signup', auth, route.signup);

app.get('/api/user/:userId', auth, route.getUser);

app.delete('/api/user/:userId', auth, route.removeUser);

app.get('/api/users/:coveyId', auth, route.getAllUsers);

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

app.get('/api/coveys/:userId', auth, route.getAllCoveys);

app.post('/api/coveys', auth, route.addCovey);

app.delete('/api/coveys/:coveyId', auth, route.removeCovey);

app.put('/api/coveys/:coveyId', auth, route.updateCovey);

app.get('/api/coveys/:coveyid', auth, route.getCovey);

app.post('/api/rides', auth, route.addRide);

app.delete('/api/rides/:carId', auth, route.removeRide);

app.get('/api/rides/:coveyId', auth, route.getAllRides);

app.get('/api/riders/:carId', auth, route.getAllRiders);

app.delete('/api/riders/:carId/:userId', auth, route.removeRider);

app.post('/api/riders/:carId/:userId', auth, route.addRider);

app.post('/api/resources', auth, route.addResource);

app.delete('/api/resources/:resourceId', auth, route.removeResource);

app.get('/api/resources/:coveyId', auth, route.getAllResources);

app.get('/api/suppliers/:resourceId', auth, route.getAllSuppliers);

app.delete('/api/suppliers/:carId/:userId', auth, route.removeSupplier);

app.post('/api/suppliers/:carId/:userId', auth, route.addSupplier);

app.post('/api/coveys/:coveyId/:userId', auth, route.addAttendee);

app.delete('/api/coveys/:coveyId/:userId', auth, route.removeAttendee);

module.exports = app;
