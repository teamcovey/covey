const db = require('../config/config.js');
const User = require('./user.js');

const Covey = db.Model.extend({
  tableName: 'coveys',
  user: () => this.belongsToMany(User),
});

module.exports = Covey;
