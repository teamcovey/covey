const db = require('../config/config.js').db;
const Covey = require('./covey.js');

const User = db.Model.extend({
  tableName: 'users',
  coveys: () => this.belongsToMany(Covey, 'coveys_users', 'covey_id', 'user_id'),
});

module.exports = User;
