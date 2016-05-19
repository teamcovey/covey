const User = require('../models/user.js');
const knex = require('../config/config.js').knex;

exports.getUser = (req, res) => {
  const userId = req.params.userId;

  if (userId) {
    new User({ userId })
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

exports.getUserName = (req, res) => {
  const userId = req.params.userId;

  knex
    .select(['users.firstName', 'users.lastName'])
    .from('users')
    .where('userId', '=', userId)
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
};

exports.removeUser = (req, res) => {
  const userId = req.params.userId;

  // we will remove the join tables that have the user_id in them
  knex('coveys_users')
    .where('userId', userId)
    .del()
    .then(() => {
      // place holder in case we need more actions
    })
    .catch((err) => {
      console.log('error in deleting coveys_users rows: ', err);
    });

  new User({ userId })
    .destroy()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getAllUsers = (req, res) => {
  const coveyId = req.params.coveyId;

  knex
    .select(['users.firstName', 'users.lastName', 'users.email', 'users.photoUrl', 'users.userId'])
    .from('users')
    .innerJoin('coveys_users', 'users.userId', 'coveys_users.userId')
    .where('coveyId', '=', coveyId)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.updateUser = (req, res) => {
  const userId = req.params.userId;
  const newObj = {};

  if (req.body.firstName) {
    newObj.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    newObj.lastName = req.body.lastName;
  }
  if (req.body.email) {
    newObj.email = req.body.email;
  }
  if (req.body.gender) {
    newObj.gender = req.body.gender;
  }
  if (req.body.phoneNumber) {
    newObj.phoneNumber = req.body.phoneNumber;
  }

  knex('users')
  .where('userId', userId)
  .update(newObj)
  .then((updatedUser) => {
    res.status(201).json({ updatedUser });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.addFriend = (req, res) => {
  const friendId = req.params.friendId;
  const userId = req.params.userId;
  if (friendId === userId) {
    res.status(409).json({ error: 'You cannot friend yourself' });
  } else {
    knex('friends')
    .where('userId', userId)
    .andWhere('friendId', friendId)
    .then((results) => {
      if (results.length === 0) {
        knex('friends')
            .returning('friendId')
            .insert({ userId, friendId })
        .then(() => {
          knex('friends')
            .returning('friendId')
            .insert({ userId: friendId, friendId: userId })
            .then((returnedFriendId) => {
              res.status(201).json({ friendId: returnedFriendId[0], success: true });
            })
            .catch((err) => {
              res.status(404).json(err);
            });
        })
        .catch((err) => {
          res.status(404).json(err);
        });
      } else {
        // it was already a friend... just return success true.
        res.status(201).json({ success: true });
      }
    })
    .catch((err) => {
      console.log('error in checking for friend before adding');
      res.status(404).json(err);
    });
  }
};

exports.removeFriend = (req, res) => {
  const friendId = req.params.friendId;
  const userId = req.params.userId;

  knex('friends')
    .where('userId', userId)
    .andWhere('friendId', friendId)
    .del()
    .then(() => {
      knex('friends')
        .where('friendId', userId)
        .andWhere('userId', friendId)
        .del()
        .then(() => {
          res.json({ success: true });
        })
        .catch((err) => {
          console.log('error in deleting friends matched rows: ', err);
          res.status(404).json(err);
        });
    })
    .catch((err) => {
      console.log('error in deleting friends rows: ', err);
      res.status(404).json(err);
    });
};

exports.getFriends = (req, res) => {
  const userId = req.params.userId;

  knex
    .select(['users.firstName', 'users.lastName', 'users.email', 'users.photoUrl', 'users.userId'])
    .from('users')
    .innerJoin('friends', 'users.userId', 'friends.userId')
    .where('friendId', '=', userId)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
