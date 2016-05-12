// TODO: Validate resource changes through joins

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

// Encryption and decryption middleware
const encryptValue = require('./helpers/cookieEncryptionMiddleware.js').encryptValue;
const decryptUserIdCookie = require('./helpers/cookieEncryptionMiddleware.js').decryptUserIdCookie;

/*
 * User validation middleware checks if the user is authorized to modify the covey
 * It has been injected into the appropriate routes below
 */
const userValidationMiddleware = require('./helpers/userValidationMiddleware.js');
const isValidCoveyMember = userValidationMiddleware.isValidCoveyMember;
const isValidResourceOwner = userValidationMiddleware.isValidResourceOwner;
const isValidCarOwner = userValidationMiddleware.isValidCarOwner;
const isValidUser = userValidationMiddleware.isValidUser;

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
app.post('/api/signup', auth, decryptUserIdCookie, route.signup); // This route is used for db + auth testing

app.get('/api/user/:userId', auth, decryptUserIdCookie, isValidUser, routeUsers.getUser);

app.get('/api/username/:userId', auth, decryptUserIdCookie, isValidUser, routeUsers.getUserName);

app.delete('/api/user/:userId', auth, decryptUserIdCookie, isValidUser, routeUsers.removeUser);

app.put('/api/user/:userId', auth, decryptUserIdCookie, isValidUser, routeUsers.updateUser);

app.get('/api/users/:coveyId', auth, decryptUserIdCookie, isValidCoveyMember, routeUsers.getAllUsers);

app.get('/api/friends/:userId', auth, decryptUserIdCookie, isValidUser, routeUsers.getFriends);

app.post('/api/friends/:userId/:friendId', auth, decryptUserIdCookie, isValidUser, routeUsers.addFriend);

app.delete('/api/friends/:userId/:friendId', auth, decryptUserIdCookie, isValidUser, routeUsers.removeFriend);

// Routes: authentication & sign-up
app.get('/api/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/api/auth/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => res.cookie('user_id', encryptValue(req.user.id.toString())).redirect('/#/coveys')
);

app.get('/api/logout',
  (req, res) => {
    req.logout();
    req.session.destroy(() => res.clearCookie('user_id').redirect('/#/'));
  }
);

app.get('/api/coveys/:userId', auth, decryptUserIdCookie, isValidUser, routeCoveys.getAllCoveys);

app.post('/api/coveys', auth, decryptUserIdCookie, isValidUser, routeCoveys.addCovey);

app.delete('/api/coveys/:coveyId', auth, decryptUserIdCookie, isValidCoveyMember, routeCoveys.removeCovey);

app.put('/api/coveys/:coveyId', auth, decryptUserIdCookie, isValidCoveyMember, routeCoveys.updateCovey);

app.get('/api/covey/:coveyId', auth, decryptUserIdCookie, isValidCoveyMember, routeCoveys.getCovey);

app.post('/api/coveys/:coveyId/:userId', auth, decryptUserIdCookie, isValidCoveyMember, routeCoveys.addAttendee);

app.delete('/api/coveys/:coveyId/:userId', auth, decryptUserIdCookie, isValidCoveyMember, routeCoveys.removeAttendee);

app.post('/api/rides', auth, decryptUserIdCookie, isValidCoveyMember, routeRides.addRide);

app.put('/api/rides/:carId', auth, decryptUserIdCookie, isValidCoveyMember, routeRides.updateRide);

app.delete('/api/rides/:carId', auth, decryptUserIdCookie, isValidCarOwner, routeRides.removeRide);

app.get('/api/rides/:coveyId', auth, decryptUserIdCookie, isValidCoveyMember, routeRides.getAllRides);

app.get('/api/riders/:carId', auth, decryptUserIdCookie, isValidCarOwner, routeRides.getAllRiders);

app.delete('/api/riders/:carId/:userId', auth, decryptUserIdCookie, isValidCarOwner, routeRides.removeRider);

app.post('/api/riders/:carId/:userId', auth, decryptUserIdCookie, isValidCarOwner, routeRides.addRider);

app.post('/api/resources', auth, decryptUserIdCookie, isValidCoveyMember, routeResources.addResource);

app.put('/api/resources/:resourceId', auth, decryptUserIdCookie, isValidCoveyMember, routeResources.updateResource);

app.delete('/api/resources/:resourceId', auth, decryptUserIdCookie, isValidResourceOwner, routeResources.removeResource);

app.get('/api/resources/:coveyId', auth, decryptUserIdCookie, isValidCoveyMember, routeResources.getAllResources);

app.get('/api/suppliers/:resourceId', auth, decryptUserIdCookie, isValidResourceOwner, routeResources.getAllSuppliers);

app.delete('/api/suppliers/:resourceId/:userId', auth, decryptUserIdCookie, isValidResourceOwner,
  routeResources.removeSupplier);

app.post('/api/suppliers/:resourceId/:userId', auth, decryptUserIdCookie, isValidResourceOwner,
  routeResources.addSupplier);

app.get('/api/searchUsers/:searchVal', auth, decryptUserIdCookie, route.searchUsers);

module.exports = app;
