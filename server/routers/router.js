const app = require('../config/server-config.js');
const express = require('express');

/*
We are using both knex and bookshelf in the router files.  We were unable to get
bookshelf to create the join tables for us so decided to write the sql by hand.
*/

const route = require('./router-helpers');
const routeUsers = require('./router-users');
const routeCoveys = require('./router-coveys');
const routeRides = require('./router-rides');
const routeResources = require('./router-resources');

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
app.use(express.static('client'));

// Routes: app
app.get('/', route.getUsage);

app.post('/api/signup', auth, route.signup);

app.get('/api/user/:userId', auth, routeUsers.getUser);

app.delete('/api/user/:userId', auth, routeUsers.removeUser);

app.put('/api/user/:userId', auth, routeUsers.updateUser);

app.get('/api/users/:coveyId', auth, routeUsers.getAllUsers);

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

app.get('/api/coveys/:userId', auth, routeCoveys.getAllCoveys);

app.post('/api/coveys', auth, routeCoveys.addCovey);

app.delete('/api/coveys/:coveyId', auth, routeCoveys.removeCovey);

app.put('/api/coveys/:coveyId', auth, routeCoveys.updateCovey);

app.get('/api/covey/:coveyid', auth, routeCoveys.getCovey);

app.post('/api/coveys/:coveyId/:userId', auth, routeCoveys.addAttendee);

app.delete('/api/coveys/:coveyId/:userId', auth, routeCoveys.removeAttendee);

app.post('/api/rides', auth, routeRides.addRide);

app.put('/api/rides/:carId', auth, routeRides.updateRide);

app.delete('/api/rides/:carId', auth, routeRides.removeRide);

app.get('/api/rides/:coveyId', auth, routeRides.getAllRides);

app.get('/api/riders/:carId', auth, routeRides.getAllRiders);

app.delete('/api/riders/:carId/:userId', auth, routeRides.removeRider);

app.post('/api/riders/:carId/:userId', auth, routeRides.addRider);

app.post('/api/resources', auth, routeResources.addResource);

app.put('/api/resources/:resourceId', auth, routeResources.updateResource);

app.delete('/api/resources/:resourceId', auth, routeResources.removeResource);

app.get('/api/resources/:coveyId', auth, routeResources.getAllResources);

app.get('/api/suppliers/:resourceId', auth, routeResources.getAllSuppliers);

app.delete('/api/suppliers/:resourceId/:userId', auth, routeResources.removeSupplier);

app.post('/api/suppliers/:resourceId/:userId', auth, routeResources.addSupplier);

module.exports = app;
