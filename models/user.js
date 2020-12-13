const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* 스키마 생성 */
const UserSchema = new Schema({
  userId: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  salt: {
    type: String,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  mail: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    required: true,
  },
  modified: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);

function addUser({ userId, password, salt, name, mail, created, modified }) {
  const user = new User({
    userId,
    password,
    salt,
    name,
    mail,
    created,
    modified,
  });
  return user.save();
}

function findUserByUserId(userId) {
  return User.findOne({ userId }).exec();
}

module.exports = { addUser, findUserByUserId };
