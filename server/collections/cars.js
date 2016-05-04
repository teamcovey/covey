const db = require('../config/config.js').db;
const Car = require('../models/car.js');

const Cars = new db.Collection();

Cars.model = Car;

module.exports = Cars;
