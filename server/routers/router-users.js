const User = require('../models/user.js');
const knex = require('../config/config.js').knex;

exports.getUser = (req, res) => {
  const userId = req.params.userId;

  if (userId) {
    new User({ id: userId })
      .fetch()
      .then((foundUser) => {
        if (foundUser) {
          res.status(200).json({ user: foundUser });
        } else {
          res.status(404).json('Could not find user in database');
        }
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  } else {
    res.status(404).json({ errorMessage: 'no userId' });
  }
};

exports.removeUser = (req, res) => {
  const userId = req.params.userId;

  // we will remove the join tables that have the user_id in them
  knex('coveys_users')
    .where('user_id', userId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
    })
    .catch((err) => {
      console.log('error in deleting coveys_users rows: ', err);
    });

  new User({ id: userId })
    .destroy()
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getAllUsers = (req, res) => {
  const coveyId = req.params.coveyId;

  knex.from('users')
    .innerJoin('coveys_users', 'users.id', 'coveys_users.user_id')
    .where('covey_id', '=', coveyId)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.updateUser = (req, res) => {
  const userId = req.params.userId;

  const facebookId = req.body.facebookId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const gender = req.body.gender;
  const photoUrl = req.body.photoUrl;
  const phoneNumber = req.body.phoneNumber;

  User.where({ id: userId })
    .fetch()
    .then((user) => {
      user.set('facebookId', facebookId);
      user.set('firstName', firstName);
      user.set('lastName', lastName);
      user.set('email', email);
      user.set('gender', gender);
      user.set('photoUrl', photoUrl);
      user.set('phoneNumber', phoneNumber);
      user.save()
        .then((updatedUser) => {
          res.status(201).send({ updatedUser });
        });
    })
  .catch((err) => {
    res.status(404).json(err);
  });
};

