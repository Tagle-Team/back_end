const dbConfig = require('../config/db.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

/* model */
db.user = require('./user.model.js')(mongoose);
db.board = require('./board.model.js')(mongoose);

module.exports = db;
