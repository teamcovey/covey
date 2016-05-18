const db = require('../config/config.js').db;
const Covey = require('./covey.js');

const User = db.Model.extend({
  tableName: 'users',
  coveys: () => this.belongsToMany(Covey, 'coveys_users', 'coveyId', 'userId'),
});

module.exports = User;
