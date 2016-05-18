// TODO: Validate resource changes through joins

const app = require('../config/server-config.js');
const express = require('express');

/* Set up sockets with http server and express middleware */
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Client connected...');
  socket.on('echo', (data) => {
    io.sockets.emit('message', data);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

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
const routeExpenses = require('./router-expenses');
const routeEmail = require('./router-email');

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
const isAuthorizedToUpdateResource = userValidationMiddleware.isAuthorizedToUpdateResource;
const isAuthorizedToUpdateCar = userValidationMiddleware.isAuthorizedToUpdateCar;
const isAuthorizedToUpdateExpense = userValidationMiddleware.isAuthorizedToUpdateExpense;
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

app.get('/api/user/:userId', auth, isValidUser, routeUsers.getUser);

app.get('/api/username/:userId', auth, isValidUser, routeUsers.getUserName);

app.delete('/api/user/:userId', auth, isValidUser, routeUsers.removeUser);

app.put('/api/user/:userId', auth, isValidUser, routeUsers.updateUser);

app.get('/api/users/:coveyId', auth, isValidCoveyMember, routeUsers.getAllUsers);

app.get('/api/friends/:userId', auth, isValidUser, routeUsers.getFriends);

app.post('/api/friends/:userId/:friendId', auth, isValidUser, routeUsers.addFriend);

app.delete('/api/friends/:userId/:friendId', auth, isValidUser, routeUsers.removeFriend);

// Routes: authentication & sign-up
app.get('/api/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/api/auth/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => res.cookie('userId', req.user.userId).redirect('/#/coveys')
);

app.get('/api/logout',
  (req, res) => {
    req.logout();
    req.session.destroy(() => res.clearCookie('userId').redirect('/#/'));
  }
);

app.get('/api/coveys/:userId', auth, isValidUser, routeCoveys.getAllCoveys);

app.post('/api/coveys', auth, isValidUser, routeCoveys.addCovey);

app.delete('/api/coveys/:coveyId', auth, isValidCoveyMember, routeCoveys.removeCovey);

app.put('/api/coveys/:coveyId', auth, isValidCoveyMember, routeCoveys.updateCovey);

app.get('/api/covey/:coveyId', auth, isValidCoveyMember, routeCoveys.getCovey);

app.post('/api/coveys/:coveyId/:userId', auth, isValidCoveyMember, routeCoveys.addAttendee);

app.delete('/api/coveys/:coveyId/:userId', auth, isValidCoveyMember, routeCoveys.removeAttendee);

app.post('/api/rides', auth, isValidCoveyMember, routeRides.addRide);

app.put('/api/rides/:carId', auth, isValidCoveyMember, routeRides.updateRide);

app.delete('/api/rides/:coveyId/:carId', auth, isAuthorizedToUpdateCar, routeRides.removeRide);

app.get('/api/rides/:coveyId', auth, isValidCoveyMember, routeRides.getAllRides);

app.get('/api/riders/:carId', auth, isAuthorizedToUpdateCar, routeRides.getAllRiders);

app.delete('/api/riders/:coveyId/:carId/:userId', auth, isAuthorizedToUpdateCar, routeRides.removeRider);

app.post('/api/riders/:carId/:userId', auth, isAuthorizedToUpdateCar, routeRides.addRider);

// Routes for resources functionality

app.post('/api/resources', auth, isValidCoveyMember, routeResources.addResource);

app.put('/api/resources/:resourceId', auth, isValidCoveyMember, routeResources.updateResource);

app.delete('/api/resources/:coveyId/:resourceId',
  auth, isAuthorizedToUpdateResource, routeResources.removeResource);

app.get('/api/resources/:coveyId', auth, isValidCoveyMember, routeResources.getAllResources);

app.get('/api/suppliers/:resourceId',
  auth, isAuthorizedToUpdateResource, routeResources.getAllSuppliers);

app.delete('/api/suppliers/:coveyId/:resourceId/:userId',
  auth, isAuthorizedToUpdateResource, routeResources.removeSupplier);

app.post('/api/suppliers/:resourceId/:userId', auth, isAuthorizedToUpdateResource,
  routeResources.addSupplier);

// Routes for expense functionality

app.post('/api/expenses',
  auth, isValidCoveyMember, routeExpenses.postExpense);

app.put('/api/expenses/:expenseId',
  auth, isAuthorizedToUpdateExpense, routeExpenses.updateExpense);

app.delete('/api/expenses/:coveyId/:expenseId',
  auth, isValidCoveyMember, routeExpenses.deleteExpense);

app.get('/api/expenses/:coveyId',
  auth, isValidCoveyMember, routeExpenses.getExpenses);

app.get('/api/expenses/participants/:expenseId',
  auth, isAuthorizedToUpdateExpense, routeExpenses.getParticipants);

app.delete('/api/expenses/participants/:coveyId/:expenseId/:userId',
  auth, isAuthorizedToUpdateExpense, routeExpenses.deleteParticipant);

app.post('/api/expenses/participants/:expenseId/:userId',
  auth, isAuthorizedToUpdateExpense, routeExpenses.addParticipant);

// Routes for phone verification

app.get('/api/searchUsers/:searchVal', auth, route.searchUsers);

app.get('/api/tel/verify/:tel', auth, routeTel.generateCodeAndSend);

app.post('/api/tel', auth, routeTel.addTel);

app.get('/api/tel', auth, routeTel.hasTel);

// Routes for emails

app.post('/api/email/:coveyId/:userId', auth, isValidCoveyMember, routeEmail.sendEmail);

module.exports = { app, server };
