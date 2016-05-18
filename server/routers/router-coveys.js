const Covey = require('../models/covey.js');
const Coveys = require('../collections/coveys.js');
const User = require('../models/user.js');
const knex = require('../config/config.js').knex;

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
      .returning('coveyId')
      .insert({
        userId,
        coveyId: covey.id,
        isOwner: true,
      })
  )
  .then((coveyId) => {
    res.status(201).json({ coveyId: coveyId[0], success: true });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.getAllCoveys = (req, res) => {
  const userId = req.params.userId;

  knex.from('coveys')
    .innerJoin('coveys_users', 'coveys.coveyId', 'coveys_users.coveyId')
    .where('userId', '=', userId)
    .then((coveys) => {
      res.status(200).json(coveys);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.removeCovey = (req, res) => {
  const coveyId = req.params.coveyId;

  new Covey({ coveyId })
    .destroy()
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.updateCovey = (req, res) => {
  const coveyId = req.params.coveyId;

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

  Covey.where({ coveyId })
    .fetch()
    .then((covey) => {
      covey.set('name', name);
      covey.set('startTime', startTime);
      covey.set('endTime', endTime);
      covey.set('location', location);
      covey.set('address', address);
      covey.set('city', city);
      covey.set('state', state);
      covey.set('photoUrl', photoUrl);
      covey.set('details', details);
      covey.set('blurb', blurb);
      covey.save()
        .then((updatedCovey) => {
          res.status(201).json({ updatedCovey });
        });
    })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.addAttendee = (req, res) => {
  const coveyId = req.params.coveyId;
  const userId = req.params.userId;

  knex('coveys_users')
    .where({
      userId,
      coveyId,
    })
    .then((rows) => {
      if (rows.length !== 0) {
        res.status(409).send();
      } else {
        knex('coveys_users')
            .returning('coveyId')
            .insert({ userId, coveyId })
        .then((returnedCoveyId) => {
          new User({ userId })
            .fetch()
            .then((foundUser) => {
              if (foundUser) {
                res.status(201).json({ coveyId: returnedCoveyId[0], user: foundUser });
              } else {
                res.status(404).json('Could not find user in database');
              }
            })
            .catch((err) => {
              res.status(404).json(err);
            });
        })
        .catch((err) => {
          res.status(404).json(err);
        });
      }
    });
};

exports.removeAttendee = (req, res) => {
  const coveyId = req.params.coveyId;
  const userId = req.params.userId;
  /* eslint-disable */
  var carArray;
  var resourceArray;
  /* eslint-enable */

  knex
    .select('carId')
    .from('cars')
    .where('coveyId', coveyId)
    .then((cars) => {
      carArray = [];
      cars.forEach((car) => carArray.push(car.carId));

      knex('cars_users')
        .whereIn('carId', carArray)
        .andWhere('userId', userId)
        .del()
        .then(() => {
        })
        .catch((err) => {
          console.log('error in removing attendee from cars: ', err);
        });
    });

  knex
    .select('resourceId')
    .from('resources')
    .where('coveyId', coveyId)
    .then((resources) => {
      resourceArray = [];
      resources.forEach((resource) => resourceArray.push(resource.resourceId));

      knex('resources_users')
        .whereIn('resourceId', resourceArray)
        .andWhere('userId', userId)
        .del()
        .then(() => {
        })
        .catch((err) => {
          console.log('error in removing attendee from resources: ', err);
        });
    });

  knex('coveys_users')
    .where('userId', userId)
    .andWhere('coveyId', coveyId)
    .del()
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.log('error in deleting coveys_users rows: ', err);
      res.status(404).json(err);
    });
};

exports.getCovey = (req, res) => {
  const coveyId = req.params.coveyId;

  Covey.where({ coveyId })
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
