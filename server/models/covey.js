const db = require('../config/config.js').db;
const User = require('./user.js');
const Car = require('./car.js');

const Covey = db.Model.extend({
  tableName: 'coveys',
  users: () => this.belongsToMany(User, 'coveys_users', 'coveyId', 'userId'),
  rides: () => this.hasMany(Car),
});

module.exports = Covey;
