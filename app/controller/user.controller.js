const db = require('../models');
const User = db.user;

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
