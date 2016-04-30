// var User         = require('../models/user.js');
// var Users        = require('../collections/users.js');
// var Event        = require('../models/event.js');
// var API_KEYS = require('../api_keys.js');

exports.getUsage = (req, res) => {
  res.status(200).send('Welcome to Covey');
};

exports.addCovey = (req, res) => {
  res.status(201).send('created Covey');
};

exports.getUser = (req, res) => {
  res.status(200).send('got a User');
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
  res.status(200).send('sending a Covey');
};

