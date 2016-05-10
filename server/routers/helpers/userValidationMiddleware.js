const knex = require('../../config/config.js').knex;

/*
 * Checks if the user/covey pair exists in the join table. If the pair does not
 * exist, the user is considered inValid and will not be able to make changes to the covey
 */
exports.isValidCoveyMember = (request, response, next) => {
  const coveyId = request.params.coveyId;
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

exports.isValidResourceOwner = (request, response, next) => {
  const userId = request.cookies.user_id;
  const resourceId = request.params.resourceId;
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
          .then((coveyUsersRows) => {
            if (coveyUsersRows.length > 0) {
              next();
            } else {
              response.status(401).send();
            }
          });
      }
    });
};
