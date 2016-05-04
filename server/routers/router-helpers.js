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
// const Users        = require('../collections/users.js');
// const API_KEYS = require('../api_keys.js');

exports.getUsage = (req, res) => {
  res.status(200).json('Welcome to Covey');
};

exports.login = (req, res) => {
  res.status(200).send('Please login (Login page goes here). Now visit: /api/auth/facebook');
};

exports.addCovey = (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const location = req.body.location;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const photoUrl = req.body.photoUrl;
  const details = req.body.details;
  const blurb = req.body.blurb;

  Coveys.create({
    name,
    startTime,
    endTime,
    location,
    address,
    city,
    state,
    photoUrl,
    details,
    blurb,
  })
  .then((covey) =>
    knex('coveys_users')
      .returning('covey_id')
      .insert({ user_id: userId, covey_id: covey.id, isOwner: true })
  )
  .then((coveyId) => {
    res.status(201).json({ id: coveyId[0], success: true });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};

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

exports.getAllCoveys = (req, res) => {
  const userId = req.params.userId;

  knex.from('coveys')
    .innerJoin('coveys_users', 'coveys.id', 'coveys_users.covey_id')
    .where('user_id', '=', userId)
    .then((coveys) => {
      res.status(200).json(coveys);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.addRide = (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const seats = req.body.seats;
  const location = req.body.location;
  const departureTime = req.body.departureTime;
  const coveyId = req.body.coveyId;

  Cars.create({
    name,
    seats,
    location,
    departureTime,
    covey_id: coveyId,
  })
  .then((car) => knex('cars_users')
      .returning('car_id')
      .insert({ user_id: userId, car_id: car.attributes.id, isDriver: true })
  )
  .then((carId) => {
    res.status(201).json({ id: carId[0], success: true });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.removeRide = (req, res) => {
  const carId = req.params.carId;

  // we will remove the join tables that have the user_id in them
  knex('cars_users')
    .where('car_id', carId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
    })
    .catch((err) => {
      console.log('error in deleting cars_users rows: ', err);
    });

  new Car({ id: carId })
    .destroy()
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getAllRiders = (req, res) => {
  const carId = req.params.carId;

  knex.from('users')
    .innerJoin('cars_users', 'users.id', 'cars_users.user_id')
    .where('car_id', '=', carId)
    .then((riders) => {
      res.status(200).json(riders);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getAllRides = (req, res) => {
  const coveyId = req.params.coveyId;

  knex.from('cars')
    .where('covey_id', '=', coveyId)
    .then((cars) => {
      res.status(200).json(cars);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.removeRider = (req, res) => {
  const carId = req.params.carId;
  const userId = req.params.userId;

  knex('cars_users')
    .where('user_id', userId)
    .andWhere('car_id', carId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
      res.json({ success: true });
    })
    .catch((err) => {
      console.log('error in deleting cars_users rows: ', err);
      res.status(404).json(err);
    });
};

exports.addRider = (req, res) => {
  const carId = req.params.carId;
  const userId = req.params.userId;

  knex('cars_users')
      .returning('car_id')
      .insert({ user_id: userId, car_id: carId })
  .then((carIs) => {
    res.status(201).json({ id: carIs[0], success: true });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.addResource = (req, res) => {
  const name = req.body.name;
  const quantity = req.body.quantity;
  const type = req.body.type;
  const coveyId = req.body.coveyId;

  Resources.create({
    name,
    quantity,
    type,
    covey_id: coveyId,
  })
  .then((resource) => {
    res.status(201).json({ resource, success: true });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.removeResource = (req, res) => {
  const resourceId = req.params.resourceId;

  // we will remove the join tables that have the user_id in them
  knex('resources_users')
    .where('resource_id', resourceId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
    })
    .catch((err) => {
      console.log('error in deleting resources_users rows: ', err);
    });

  new Resource({ id: resourceId })
    .destroy()
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getAllSuppliers = (req, res) => {
  const resourceId = req.params.resourceId;

  knex.from('users')
    .innerJoin('resources_users', 'users.id', 'resources_users.user_id')
    .where('resource_id', '=', resourceId)
    .then((suppliers) => {
      res.status(200).json(suppliers);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getAllResources = (req, res) => {
  const coveyId = req.params.coveyId;

  knex.from('resources')
    .where('covey_id', '=', coveyId)
    .then((resources) => {
      res.status(200).json(resources);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.removeSupplier = (req, res) => {
  const resourceId = req.params.resourceId;
  const userId = req.params.userId;

  knex('resources_users')
    .where('user_id', userId)
    .andWhere('resource_id', resourceId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
      res.json({ success: true });
    })
    .catch((err) => {
      console.log('error in deleting resources_users rows: ', err);
      res.status(404).json(err);
    });
};

exports.addSupplier = (req, res) => {
  const resourceId = req.params.resourceId;
  const userId = req.params.userId;

  knex('resources_users')
      .returning('resource_id')
      .insert({ user_id: userId, resource_id: resourceId })
  .then((resourceIs) => {
    res.status(201).json({ id: resourceIs[0], success: true });
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

exports.removeCovey = (req, res) => {
  const coveyId = req.params.coveyId;

  // we will remove the join tables that have the covey_id in them
  knex('coveys_users')
    .where('covey_id', coveyId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
    })
    .catch((err) => {
      console.log('error in deleting coveys_users rows: ', err);
    });

  new Covey({ id: coveyId })
    .destroy()
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.updateCovey = (req, res) => {
  res.status(200).json('updat Covey not implemented yet');
};

exports.addAttendee = (req, res) => {
  const coveyId = req.params.resourceId;
  const userId = req.params.userId;

  knex('coveys_users')
      .returning('covey_id')
      .insert({ user_id: userId, covey_id: coveyId })
  .then((coveyIs) => {
    res.status(201).json({ id: coveyIs[0], success: true });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.removeAttendee = (req, res) => {
  const coveyId = req.params.coveyId;
  const userId = req.params.userId;

  knex('coveys_users')
    .where('user_id', userId)
    .andWhere('covey_id', coveyId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
      res.json({ success: true });
    })
    .catch((err) => {
      console.log('error in deleting coveys_users rows: ', err);
      res.status(404).json(err);
    });
};

exports.getCovey = (req, res) => {
  const coveyId = req.params.id;

  Covey.where({ id: coveyId })
    .fetch()
    .then((covey) => {
      if (covey) {
        res.status(200).json({ covey });
      } else {
        res.status(404).json('Could not find covey in database');
      }
    })
    .catch((err) => {
      console.error('Could not find event in database: ', err);
      res.status(404).json(err);
    });
};
