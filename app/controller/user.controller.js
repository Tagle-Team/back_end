const db = require('../models');
const User = db.user;
const { avatarMulter } = require('../middlewares/uploadFile');
const fs = require('fs');

exports.login = async (req, res) => {
  const { userId, password: inputPassword } = req.body;
  let result = false;
  let userInfo = {};

  await User.findOne({ userId }, (err, user) => {
    if (user !== null && user.validPassword(inputPassword)) {
      const { userName, email, image } = user.toJSON();
      result = true;
      userInfo = {
        userName,
        email,
        image,
      };
      const token = user.generateJWT();
      res.cookie('token', token, { httpOnly: true });
    }
  });

  return res.send({ result, userInfo });
};

exports.signOut = (req, res, next) => {
  res.locals.jwtPayload = null;
  res.cookie('token', null);
  res.status(204);

  return res.send();
};

exports.signup = (req, res) => {
  const { filename } = req.file;
  const newUser = new User();
  newUser.userId = req.body.userId;
  newUser.userName = req.body.userName;
  newUser.email = req.body.email;
  newUser.setPassword(req.body.password);
  newUser.image = filename;

  newUser.save((err, User) => {
    if (err) {
      return res.status(400).send({
        message: 'Failed to add user. (' + err + ')',
      });
    } else {
      return res.send({
        message: 'User added successfully.',
      });
    }
  });
};

exports.confirmId = async (req, res) => {
  const { id } = req.query;
  let result = false;

  await User.findOne({ userId: id })
    .then((user) => {
      if (user === null) {
        result = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return res.send({ result });
};

exports.uploadAvatar = (req, res) => {
  const { file } = req;
  let result = false;

  if (!file || Object.keys(file).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  return res.send({ result });
};

exports.confirmUser = async (req, res) => {
  const { password } = req.body;
  const { userId } = res.locals.jwtPayload;
  let result = false;
  let message = null;
  let userInfo = {};

  try {
    const user = await User.findOne({ userId });
    if (user.validPassword(password)) {
      const { userId, userName, email, image, admin } = user.toJSON();
      result = true;

      userInfo = {
        userId,
        userName,
        email,
        image,
        admin,
      };
    }
  } catch (err) {
    message = err;
  }

  return res.send({ result, message, userInfo });
};

exports.editUser = async (req, res) => {
  const { file } = req;
  const {
    userId,
    userName,
    email,
    password,
    isChangeAvatar = false,
    image,
  } = req.body;
  let result = false;
  let userInfo = {};

  const newUser = await User.findOne({ userId });
  newUser.userId = userId;
  newUser.userName = userName;
  newUser.email = email;
  newUser.setPassword(password);

  if (isChangeAvatar === 'true') {
    try {
      const staticPath = req.app.get('static');
      const path = `${staticPath}/uploads/avatar/${image}`;
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
        }

        console.log('avatar deleted');
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (!!file && file.filename) {
    newUser.image = file.filename;
  }

  const user = await newUser.save();

  if (!!user) {
    result = true;
    const { userId, userName, email, image, admin } = user;

    userInfo = {
      userId,
      userName,
      email,
      image,
      admin,
    };
  }
  return res.send({ result, userInfo });
};
