const Car = require('../models/car.js');
const Cars = require('../collections/cars.js');
const knex = require('../config/config.js').knex;

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

exports.updateRide = (req, res) => {
  const rideId = req.params.rideId;

  const name = req.body.name;
  const seats = req.body.seats;
  const location = req.body.location;
  const departureTime = req.body.departureTime;
  const coveyId = req.body.coveyId;

  Car.where({ id: rideId })
    .fetch()
    .then((ride) => {
      ride.set('name', name);
      ride.set('seats', seats);
      ride.set('location', location);
      ride.set('departureTime', departureTime);
      ride.set('covey_id', coveyId);
      ride.save()
        .then((updatedRide) => {
          res.status(201).json({ updatedRide });
        });
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

const getRiders = car =>
  knex.from('users')
    .innerJoin('cars_users', 'users.id', 'cars_users.user_id')
    .where('car_id', '=', car.id)
    .then((riders) => {
      car.riders = riders;
      return car;
    })
    .catch((err) => {
      console.log('error in getRiders.  will return empty array.  error is: ', err);
      car.riders = [];
      return car;
    });

exports.getAllRides = (req, res) => {
  const coveyId = req.params.coveyId;

  knex.from('cars')
    // .innerJoin('cars_users', 'cars.id', 'cars_users.car_id')
    // .innerJoin('users', 'users.id', 'cars_users.user_id')
    .where('covey_id', '=', coveyId)
    .then((cars) => {
      const requests = [];
      const output = [];
/* eslint-disable */
      for (var i = 0; i < cars.length; i++) {
        const carPromise = new Promise((resolve) => {
/* eslint-enable */
          getRiders(cars[i])
          .then((car) => {
            output.push(car);
            resolve();
          });
        });
        requests.push(carPromise);
      }
      Promise.all(requests).then(() => {
        console.log('all the riders were joined to car');
        res.status(200).json(output);
      });
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
