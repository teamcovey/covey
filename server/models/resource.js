const db = require('../config/config.js').db;
const User = require('./user.js');
const Covey = require('./covey.js');

const Resource = db.Model.extend({
  tableName: 'resources',
  idAttribute: 'resourceId',
  covey: () => this.belongsTo(Covey),
  users: () => this.belongsToMany(User, 'resources_users', 'resourceId', 'userId'),
});

module.exports = Resource;
