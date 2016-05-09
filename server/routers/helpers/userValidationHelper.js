const knex = require('../../config/config.js').knex;

/*
 * Checks if the user/covey pair exists in the join table. If the pair does not
 * exist, the user is considered inValid and will not be able to make changes to the covey
 */
exports.isValidUser = (userId, coveyId) => {
  return knex('coveys_users')
    .where({
      user_id: userId,
      covey_id: coveyId,
    })
    .then((rows) => {
      if (rows.length > 0) return true;
      return false;
    });
};
