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
const auth = require('connect-ensure-login').ensureLoggedIn('/');
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

// Routes: Users
app.post('/api/signup', route.signup); // This route is used for db + auth testing

app.get('/api/user/:userId', routeUsers.getUser);

app.delete('/api/user/:userId', routeUsers.removeUser);

app.put('/api/user/:userId', routeUsers.updateUser);

app.get('/api/users/:coveyId', routeUsers.getAllUsers);

app.get('/api/friends/:userId', routeUsers.getFriends);

app.post('/api/friends/:userId/:friendId', routeUsers.addFriend);

app.delete('/api/friends/:userId/:friendId', routeUsers.removeFriend);

// Routes: authentication & sign-up
app.get('/api/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/api/auth/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => res.cookie('user_id', req.user.id).redirect('/#/coveys')
);

app.get('/api/logout',
  (req, res) => {
    req.logout();
    req.session.destroy(() => res.cookie('user_id', req.user).redirect('/#/'));
  }
);

app.get('/api/coveys/:userId', routeCoveys.getAllCoveys);

app.post('/api/coveys', routeCoveys.addCovey);

app.delete('/api/coveys/:coveyId', routeCoveys.removeCovey);

app.put('/api/coveys/:coveyId', routeCoveys.updateCovey);

app.get('/api/covey/:coveyId', routeCoveys.getCovey);

app.post('/api/coveys/:coveyId/:userId', routeCoveys.addAttendee);

app.delete('/api/coveys/:coveyId/:userId', routeCoveys.removeAttendee);

app.post('/api/rides', routeRides.addRide);

app.put('/api/rides/:rideId', routeRides.updateRide);

app.delete('/api/rides/:carId', routeRides.removeRide);

app.get('/api/rides/:coveyId', routeRides.getAllRides);

app.get('/api/riders/:carId', routeRides.getAllRiders);

app.delete('/api/riders/:carId/:userId', routeRides.removeRider);

app.post('/api/riders/:carId/:userId', routeRides.addRider);

app.post('/api/resources', routeResources.addResource);

app.put('/api/resources/:resourceId', routeResources.updateResource);

app.delete('/api/resources/:resourceId', routeResources.removeResource);

app.get('/api/resources/:coveyId', routeResources.getAllResources);

app.get('/api/suppliers/:resourceId', routeResources.getAllSuppliers);

app.delete('/api/suppliers/:resourceId/:userId', routeResources.removeSupplier);

app.post('/api/suppliers/:resourceId/:userId', routeResources.addSupplier);

module.exports = app;
