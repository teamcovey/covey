const db = require('../config/config.js').db;
const User = require('./user.js');
const Covey = require('./covey.js');

const Resource = db.Model.extend({
  tableName: 'resources',
  covey: () => this.belongsTo(Covey),
  users: () => this.belongsToMany(User, 'resources_users', 'resource_id', 'user_id'),
});

module.exports = Resource;
