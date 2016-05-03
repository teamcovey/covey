const db = require('../config/config.js').db;
const Covey = require('../models/covey.js');

const Coveys = new db.Collection();

Coveys.model = Covey;

module.exports = Coveys;
