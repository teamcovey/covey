const knex = require('../../config/config.js').knex;

const isValidUser = (userId, coveyId) => {
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

module.exports = isValidUser;
