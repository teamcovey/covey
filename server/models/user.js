const db = require('../config/config.js');
const Covey = require('./covey.js');

const User = db.Model.extend({
  tableName: 'users',
  events: () => this.belongsToMany(Covey),
});

module.exports = User;
