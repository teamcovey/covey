// TODO: Validate resource changes through joins

const app = require('../config/server-config.js');
const express = require('express');

// TESTING SOCKETS
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('YAY SOCKETS client connected!');
  socket.on('echo', (data) => {
    io.sockets.emit('message', data);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
// END TESTING SOCKETS


/*
We are using both knex and bookshelf in the router files.  We were unable to get
bookshelf to create the join tables for us so decided to write the sql by hand.
*/

const route = require('./router-helpers');
const routeUsers = require('./router-users');
const routeCoveys = require('./router-coveys');
const routeRides = require('./router-rides');
const routeResources = require('./router-resources');
const routeTel = require('./router-tel');

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
const decryptUserId = require('./helpers/cookieEncryptionMiddleware.js').decryptUserId;

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
app.post('/api/signup', auth, route.signup); // This route is used for db + auth testing

app.get('/api/user/:userId', auth, decryptUserId, isValidUser, routeUsers.getUser);

app.get('/api/username/:userId', auth, decryptUserId, isValidUser, routeUsers.getUserName);

app.delete('/api/user/:userId', auth, decryptUserId, isValidUser, routeUsers.removeUser);

app.put('/api/user/:userId', auth, decryptUserId, isValidUser, routeUsers.updateUser);

app.get('/api/users/:coveyId', auth, decryptUserId, isValidCoveyMember, routeUsers.getAllUsers);

app.get('/api/friends/:userId', auth, decryptUserId, isValidUser, routeUsers.getFriends);

app.post('/api/friends/:userId/:friendId', auth, decryptUserId, isValidUser, routeUsers.addFriend);

app.delete('/api/friends/:userId/:friendId', auth, decryptUserId, isValidUser, routeUsers.removeFriend);

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

app.get('/api/coveys/:userId', auth, decryptUserId, isValidUser, routeCoveys.getAllCoveys);

app.post('/api/coveys', auth, decryptUserId, isValidUser, routeCoveys.addCovey);

app.delete('/api/coveys/:coveyId', auth, decryptUserId, isValidCoveyMember, routeCoveys.removeCovey);

app.put('/api/coveys/:coveyId', auth, decryptUserId, isValidCoveyMember, routeCoveys.updateCovey);

app.get('/api/covey/:coveyId', auth, decryptUserId, isValidCoveyMember, routeCoveys.getCovey);

app.post('/api/coveys/:coveyId/:userId', auth, decryptUserId, isValidCoveyMember, routeCoveys.addAttendee);

app.delete('/api/coveys/:coveyId/:userId', auth, decryptUserId, isValidCoveyMember, routeCoveys.removeAttendee);

app.post('/api/rides', auth, decryptUserId, isValidCoveyMember, routeRides.addRide);

app.put('/api/rides/:carId', auth, decryptUserId, isValidCoveyMember, routeRides.updateRide);

app.delete('/api/rides/:carId', auth, decryptUserId, isValidCarOwner, routeRides.removeRide);

app.get('/api/rides/:coveyId', auth, decryptUserId, isValidCoveyMember, routeRides.getAllRides);

app.get('/api/riders/:carId', auth, decryptUserId, isValidCarOwner, routeRides.getAllRiders);

app.delete('/api/riders/:carId/:userId', auth, decryptUserId, isValidCarOwner, routeRides.removeRider);

app.post('/api/riders/:carId/:userId', auth, decryptUserId, isValidCarOwner, routeRides.addRider);

app.post('/api/resources', auth, decryptUserId, isValidCoveyMember, routeResources.addResource);

app.put('/api/resources/:resourceId', auth, decryptUserId, isValidCoveyMember, routeResources.updateResource);

app.delete('/api/resources/:coveyId/:resourceId', auth, decryptUserId, isValidResourceOwner, routeResources.removeResource);

app.get('/api/resources/:coveyId', auth, decryptUserId, isValidCoveyMember, routeResources.getAllResources);

app.get('/api/suppliers/:resourceId', auth, decryptUserId, isValidResourceOwner, routeResources.getAllSuppliers);

app.delete('/api/suppliers/:coveyId/:resourceId/:userId', auth, decryptUserId, isValidResourceOwner, routeResources.removeSupplier);

app.post('/api/suppliers/:resourceId/:userId', auth, decryptUserId, isValidResourceOwner,
  routeResources.addSupplier);

app.get('/api/searchUsers/:searchVal', auth, decryptUserId, route.searchUsers);

app.get('/api/tel/verify/:tel', auth, decryptUserId, routeTel.generateCodeAndSend);

app.post('/api/tel', auth, decryptUserId, routeTel.addTel);

app.get('/api/tel', auth, decryptUserId, routeTel.hasTel);

module.exports = { app, server };
