const app = require('../config/server-config.js');
const express = require('express');

/*
We are using both knex and bookshelf in the router files.  We were unable to get
bookshelf to create the join tables for us so decided to write the sql by hand.
*/

const route = require('./router-helpers');
/* TOBENS REBASE >> */
const routeUsers = require('./router-users');
const routeCoveys = require('./router-coveys');
const routeRides = require('./router-rides');
const routeResources = require('./router-resources');
/* END TOBENS REBASE */
const express = require('express');

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
app.post('/api/signup', auth, route.signup); // This route is used for db + auth testing

// app.delete('/api/user/:userId', auth, routeUsers.removeUser);

// app.put('/api/user/:userId', auth, routeUsers.updateUser);

// app.get('/api/users/:coveyId', auth, routeUsers.getAllUsers);
/* << END TOBENS REBASE */

app.get('/api/user/:userId', route.getUser);

app.delete('/api/user/:userId', route.removeUser);

app.get('/api/users/:coveyId', route.getAllUsers);

app.get('/api/friends/:userId', auth, routeUsers.getFriends);

app.post('/api/friends/:userId/:friendId', auth, routeUsers.addFriend);

app.delete('/api/friends/:userId/:friendId', auth, routeUsers.removeFriend);

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

/* TOBENS REBASE >> */
// app.get('/api/coveys/:userId', auth, routeCoveys.getAllCoveys);

// app.post('/api/coveys', auth, routeCoveys.addCovey);

// app.delete('/api/coveys/:coveyId', auth, routeCoveys.removeCovey);

// app.put('/api/coveys/:coveyId', auth, routeCoveys.updateCovey);

// app.get('/api/covey/:coveyid', auth, routeCoveys.getCovey);

// app.post('/api/coveys/:coveyId/:userId', auth, routeCoveys.addAttendee);

// app.delete('/api/coveys/:coveyId/:userId', auth, routeCoveys.removeAttendee);

// app.post('/api/rides', auth, routeRides.addRide);

// app.delete('/api/rides/:carId', auth, routeRides.removeRide);

// app.get('/api/rides/:coveyId', auth, routeRides.getAllRides);

// app.get('/api/riders/:carId', auth, routeRides.getAllRiders);

// app.delete('/api/riders/:carId/:userId', auth, routeRides.removeRider);

// app.post('/api/riders/:carId/:userId', auth, routeRides.addRider);

// app.post('/api/resources', auth, routeResources.addResource);

// app.delete('/api/resources/:resourceId', auth, routeResources.removeResource);

// app.get('/api/resources/:coveyId', auth, routeResources.getAllResources);

// app.get('/api/suppliers/:resourceId', auth, routeResources.getAllSuppliers);

// app.delete('/api/suppliers/:resourceId/:userId', auth, routeResources.removeSupplier);

// app.post('/api/suppliers/:resourceId/:userId', auth, routeResources.addSupplier);
/*<< END TOBENS REBASE*/

app.get('/api/coveys/:userId', route.getAllCoveys);

app.post('/api/coveys', route.addCovey);

app.delete('/api/coveys/:coveyId', route.removeCovey);

app.put('/api/coveys/:coveyId', route.updateCovey);

app.get('/api/covey/:coveyId', route.getCovey);

app.post('/api/coveys/:coveyId/:userId', route.addAttendee);

app.delete('/api/coveys/:coveyId/:userId', route.removeAttendee);

app.post('/api/rides', route.addRide);

app.put('/api/rides/:carId', auth, routeRides.updateRide);

app.delete('/api/rides/:carId', auth, routeRides.removeRide);

app.get('/api/rides/:coveyId', route.getAllRides);

app.get('/api/riders/:carId', route.getAllRiders);

app.delete('/api/riders/:carId/:userId', route.removeRider);

app.post('/api/riders/:carId/:userId', route.addRider);

app.post('/api/resources', route.addResource);

app.put('/api/resources/:resourceId', auth, routeResources.updateResource);

app.delete('/api/resources/:resourceId', auth, routeResources.removeResource);

app.get('/api/resources/:coveyId', route.getAllResources);

app.get('/api/suppliers/:resourceId', route.getAllSuppliers);

app.delete('/api/suppliers/:resourceId/:userId', route.removeSupplier);

app.post('/api/suppliers/:resourceId/:userId', route.addSupplier);

module.exports = app;
