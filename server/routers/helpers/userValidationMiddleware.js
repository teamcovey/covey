const knex = require('../../config/config.js').knex;

/*
 * Checks if the user/covey pair exists in the join table. If the pair does not
 * exist, the user is considered inValid and will not be able to make changes to the covey
 */
exports.isValidCoveyMember = (request, response, next) => {
  const coveyId = request.params.coveyId;
  const userId = request.cookies.user_id;
  return knex('coveys_users')
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

exports.isValidResourceOwner = (request, response, next) => {
  const resourceId = request.params.resourceId;
  const userId = request.cookies.user_id;
  return knex('resources_users')
    .where({
      resource_id: resourceId,
      user_id: userId,
    })
    .then((rows) => {
      if (rows.length > 0) {
        next();
      } else {
        response.status(401).send();
      }
    });
};
