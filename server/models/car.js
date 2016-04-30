const db = require('../config/config.js');
const User = require('./user.js');
const Covey = require('./covey.js');

const Car = db.Model.extend({
  tableName: 'cars',
  covey: () => this.belongsTo(Covey),
  user: () => this.belongsToMany(User),
});

module.exports = Car;
