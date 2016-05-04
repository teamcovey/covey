const db = require('../config/config.js').db;
const Resource = require('../models/resource.js');

const Resources = new db.Collection();

Resources.model = Resource;

module.exports = Resources;
