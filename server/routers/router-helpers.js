const User = require('../models/user.js');
const Users = require('../collections/users.js');
const Covey = require('../models/covey.js');
const Coveys = require('../collections/coveys.js');
const knex = require('../config/config.js').knex;
const Car = require('../models/car.js');
const Cars = require('../collections/cars.js');
const Resource = require('../models/resource.js');
const Resources = require('../collections/resources.js');

// not using these yet, but they could come into play soon.
// const API_KEYS = require('../api_keys.js');

/*
We are using both knex and bookshelf in several areas below.  We were unable to get
bookshelf to create the join tables for us so decided to write the sql by hand.
*/

exports.getUsage = (req, res) => {
  res.status(200).json('Welcome to Covey');
};

exports.login = (req, res) => {
  res.status(200).send('Please login (Login page goes here). Now visit: /api/auth/facebook');
};

exports.signup = (req, res) => {
  const facebookId = req.body.facebookId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const gender = req.body.gender;
  const photoUrl = req.body.photoUrl;
  const phoneNumber = req.body.phoneNumber;
  const accessToken = req.body.accessToken;
  const refreshToken = req.body.refreshToken;

  if (facebookId) {
    new User({ facebookId })
      .fetch()
      .then((found) => {
        if (found) {
          res.status(409).json({
            errorMessage: 'Sorry, that facebook acount is already in the database!',
          });
        } else {
          Users.create({
            facebookId,
            firstName,
            lastName,
            email,
            gender,
            photoUrl,
            phoneNumber,
            accessToken,
            refreshToken,
          })
          .then((user) => {
            res.status(201).json({ id: user.attributes.id, success: true });
          })
          .catch((err) => {
            res.status(404).json(err);
          });
        }
      });
  } else {
    res.status(404).json({ errorMessage: 'no facebookId' });
  }
};
