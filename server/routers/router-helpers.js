const User = require('../models/user.js');
const Users = require('../collections/users.js');
// const Users        = require('../collections/users.js');
const Covey = require('../models/covey.js');
const Coveys = require('../collections/coveys.js');
// const db = require('../config/config.js').db;
const knex = require('../config/config.js').knex;
// const Car = require('../models/car.js');
// const Resource = require('../models/resource.js');
// const API_KEYS = require('../api_keys.js');

exports.getUsage = (req, res) => {
  res.status(200).send('Welcome to Covey');
};

exports.login = (req, res) => {
  res.status(200).send('Please login (Login page goes here). Now visit: /api/auth/facebook');
};

exports.addCovey = (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const time = req.body.time;
  const location = req.body.location;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const photoUrl = req.body.photoUrl;
  const details = req.body.details;
  const blurb = req.body.blurb;

  Coveys.create({
    name,
    time,
    location,
    address,
    city,
    state,
    photoUrl,
    details,
    blurb,
  })
  .then((covey) => {
    // add covey_id & user_id to coveys_users with isOwner flag true
    return knex('coveys_users')
      .returning('covey_id')
      .insert({ user_id: userId, covey_id: covey.id, isOwner: true });
  })
  .then((coveyId) => {
    console.log('we got c_u back: ', coveyId);
    res.status(201).send({ id: coveyId[0], success: true });
  })
  .catch((err) => {
    res.status(404).send(err);
  });
  // res.status(201).send('created Covey');
};

exports.getUser = (req, res) => {
  const userId = req.params.userId;
  // console.log(req.body);
  // const userId = req.body.userId;
  if (userId) {
    new User({ id: userId })
      .fetch()
      .then((foundUser) => {
        if (foundUser) {
          // console.log('user is: ', foundUser);
          res.status(200).send({
            user: foundUser,
          });
        } else {
          res.status(404).send('Could not find user in database');
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } else {
    res.status(404).json({ errorMessage: 'no userId' });
  }
};

exports.removeUser = (req, res) => {
  const userId = req.params.userId;

  User.where({ id: userId })
    .destroy({})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
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
          res.status(409).send({
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
            res.status(201).send({ id: user.attributes.id, success: true });
          })
          .catch((err) => {
            res.status(404).send(err);
          });
        }
      });
  } else {
    res.status(404).json({ errorMessage: 'no facebookId' });
  }
};

exports.getAllCoveys = (req, res) => {
  // const userId = req.params.userId;

  res.status(200).send('sending all Coveys');
};

exports.removeCovey = (req, res) => {
  res.status(200).send('removed a Covey');
};

exports.updateCovey = (req, res) => {
  res.status(200).send('updated a Covey');
};

exports.getCovey = (req, res) => {
  const coveyId = req.params.id;

  Covey.where({ id: coveyId })
    .fetch()
    .then((covey) => {
      console.log('testing covey response ', covey);
      res.status(200).send(`sending a single Covey: ${coveyId}`);
    })
    .catch((err) => {
      console.error('Could not find event in database: ', err);
      res.status(404).send(err);
    });
};

