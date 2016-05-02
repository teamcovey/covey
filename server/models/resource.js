const db = require('../config/config.js');
const User = require('./user.js');
const Covey = require('./covey.js');

const Resource = db.Model.extend({
  tableName: 'resources',
  covey: () => this.belongsTo(Covey),
  user: () => this.belongsToMany(User),
});

module.exports = Resource;
