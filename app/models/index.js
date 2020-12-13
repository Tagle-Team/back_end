const dbConfig = require('../config/db.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('debug', true);

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

/* model */
db.user = require('./user.model.js')(mongoose);

module.exports = db;
