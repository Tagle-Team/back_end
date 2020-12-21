const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

module.exports = (mongoose) => {
  const userSchema = mongoose.Schema({
    userId: {
      type: String,
      trim: true,
      required: true,
    },
    userName: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    image: String,
    password: {
      type: String,
      trim: true,
      required: true,
    },
    salt: String,
    admin: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  });

  userSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  // 날짜값 설정
  userSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) this.created_at = currentDate;
    next();
  });
  // password setter
  userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto
      .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
      .toString('hex');
  };
  // validate passwords
  userSchema.methods.validPassword = function (password) {
    let hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
      .toString('hex');
    return this.password === hash;
  };
  // generate JWT
  userSchema.methods.generateJWT = function () {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign(
      {
        id: this._id,
        userId: this.userId,
        userName: this.userName,
        exp: parseInt(exp.getTime() / 1000),
      },
      secret
    );
  };
  // get the JSON representation of a user for authentication.
  userSchema.methods.toAuthJSON = function () {
    return {
      userName: this.userName,
      email: this.email,
      token: this.generateJWT(),
      image: this.image,
    };
  };

  const User = mongoose.model('User', userSchema, 'User');

  return User;
};
