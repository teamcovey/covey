const User = require('../models/user.js');
const Users = require('../collections/users.js');
// const Users        = require('../collections/users.js');
const Covey = require('../models/covey.js');
// const Car = require('../models/car.js');
// const Resource = require('../models/resource.js');
// const API_KEYS = require('../api_keys.js');

exports.getUsage = (req, res) => {
  res.status(200).send('Welcome to Covey');
};

exports.addCovey = (req, res) => {
  res.status(201).send('created Covey');
};

exports.getUser = (req, res) => {
  res.status(200).send('got a User');
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
  new User({ facebookId: facebookId })
    .fetch()
    .then((found) => {
      if (found) {
        console.log('Sorry, that facebook acount is already in the database!');
        res.status(409).send({ success: false });
      } else {
        Users.create({
          facebookId: facebookId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          gender: gender,
          photoUrl: photoUrl,
          phoneNumber: phoneNumber,
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
        .then((user) => {
          res.status(201).send({ id: user.attributes.id, success: true });
        })
        .catch((err) => {
          console.error('Error signing up new user', err);
          res.status(404).send(err);
        });
      }
    });
};
exports.getAllCoveys = (req, res) => {
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

  // console.log('req stuff: ', req.params, req.body);
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

