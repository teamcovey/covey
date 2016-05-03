const db = require('../config/config.js').db;
const User = require('./user.js');

const Covey = db.Model.extend({
  tableName: 'coveys',
  users: () => this.belongsToMany(User, 'coveys_users', 'covey_id', 'user_id'),
});

module.exports = Covey;
