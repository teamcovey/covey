const knex = require('../../config/config.js').knex;

/*
 * Checks if the user/covey pair exists in the join table. If the pair does not
 * exist, the user is considered inValid and will not be able to make changes to the covey
 */
exports.isValidCoveyMember = (request, response, next) => {
  const coveyId = request.params.coveyId || request.body.coveyId;
  const userId = request.cookies.userId;
  knex('coveys_users')
    .where({
      userId,
      coveyId,
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
exports.isAuthorizedToUpdateResource = (request, response, next) => {
  const userId = request.cookies.userId;
  const resourceId = request.params.resourceId || request.body.resourceId;
  // Gets coveyId from resources table
  knex
    .select('coveyId')
    .from('resources')
    .where({
      resourceId,
    })
    .then((resourcesRows) => {
      if (resourcesRows.length === 0) {
        response.status(404).send();
      } else {
        const coveyId = resourcesRows[0].coveyId;
        // Checks if both coveyId and userId exist in join table
        knex('coveys_users')
          .where({
            userId,
            coveyId,
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
exports.isAuthorizedToUpdateCar = (request, response, next) => {
  const userId = request.cookies.userId;
  const carId = request.params.carId;
  // Gets coveyId from cars table
  knex
    .select('coveyId')
    .from('cars')
    .where({
      carId,
    })
    .then((carsRows) => {
      if (carsRows.length === 0) {
        response.status(404).send();
      } else {
        const coveyId = carsRows[0].coveyId;
        // Checks if both coveyId and userId exist in join table
        knex('coveys_users')
          .where({
            userId,
            coveyId,
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
 * Checks if the user is authorized to make change to the expense
 * Authorization is determined by their membership in the covey that contains this expense
 */
exports.isAuthorizedToUpdateExpense = (request, response, next) => {
  const userId = request.cookies.userId;
  const expenseId = request.params.expenseId || request.body.expenseId;
  // Gets coveyId from expenses table
  knex
    .select('coveyId')
    .from('expenses')
    .where({
      expenseId,
    })
    .then((expensesRows) => {
      if (expensesRows.length === 0) {
        response.status(404).send();
      } else {
        const coveyId = expensesRows[0].coveyId;
        // Checks if both coveyId and userId exist in join table
        knex('coveys_users')
          .where({
            userId,
            coveyId,
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
  const userIdCookie = request.cookies.userId;
  if (userIdParams.toString() === userIdCookie.toString()) {
    next();
  } else {
    response.status(401).send();
  }
};
