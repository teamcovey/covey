const knex = require('../../config/config.js').knex;

/*
 * Checks if the user/covey pair exists in the join table. If the pair does not
 * exist, the user is considered inValid and will not be able to make changes to the covey
 */
exports.isValidCoveyMember = (request, response, next) => {
  const coveyId = request.params.coveyId
    || request.params.covey_id
    || request.body.covey_id
    || request.body.coveyId;
  const userId = request.cookies.user_id;
  knex('coveys_users')
    .where({
      user_id: userId,
      covey_id: coveyId,
    })
    .then((rows) => {
      if (rows.length > 0) {
        next();
      } else {
        response.status(401).send();
      }
    });
};

/*
 * Checks if the user is authorized to make change to the resource
 * Authorization is determined by their membership in the covey that contains this resource
 */
exports.isValidResourceOwner = (request, response, next) => {
  const userId = request.cookies.user_id;
  const resourceId = request.params.resourceId || request.body.resourceId;
  // Gets coveyId from resources table
  knex
    .select('covey_id')
    .from('resources')
    .where({
      id: resourceId,
    })
    .then((resourcesRows) => {
      if (resourcesRows.length === 0) {
        response.status(404).send();
      } else {
        const coveyId = resourcesRows[0].covey_id;
        // Checks if both coveyId and userId exist in join table
        knex('coveys_users')
          .where({
            user_id: userId,
            covey_id: coveyId,
          })
          .then((coveysUsersRows) => {
            if (coveysUsersRows.length > 0) {
              next();
            } else {
              response.status(401).send();
            }
          });
      }
    });
};

/*
 * Checks if the user is authorized to make change to the car
 * Authorization is determined by their membership in the covey that contains this car
 */
exports.isValidCarOwner = (request, response, next) => {
  const userId = request.cookies.user_id;
  const carId = request.params.carId;
  // Gets coveyId from cars table
  knex
    .select('covey_id')
    .from('cars')
    .where({
      id: carId,
    })
    .then((carsRows) => {
      if (carsRows.length === 0) {
        response.status(404).send();
      } else {
        const coveyId = carsRows[0].covey_id;
        // Checks if both coveyId and userId exist in join table
        knex('coveys_users')
          .where({
            user_id: userId,
            covey_id: coveyId,
          })
          .then((coveysUsersRows) => {
            if (coveysUsersRows.length > 0) {
              next();
            } else {
              response.status(401).send();
            }
          });
      }
    });
};

/*
 * Checks if the person trying to make profile changes is the user
 */
exports.isValidUser = (request, response, next) => {
  const userIdParams = request.params.userId || request.body.userId;
  const userIdCookie = request.cookies.user_id;
  if (userIdParams.toString() === userIdCookie.toString()) {
    next();
  } else {
    response.status(401).send();
  }
};
