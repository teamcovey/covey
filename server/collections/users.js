const db = require('../config/config.js').db;
const User = require('../models/user.js');

const Users = new db.Collection();

Users.model = User;

module.exports = Users;
