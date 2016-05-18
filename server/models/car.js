const db = require('../config/config.js').db;
const User = require('./user.js');
const Covey = require('./covey.js');

const Car = db.Model.extend({
  tableName: 'cars',
  covey: () => this.belongsTo(Covey),
  users: () => this.belongsToMany(User, 'cars_users', 'carId', 'userId'),
});

module.exports = Car;
