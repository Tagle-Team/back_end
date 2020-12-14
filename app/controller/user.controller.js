const db = require('../models');
const User = db.user;

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user === null) {
      return res.status(400).send({
        message: 'User not found.',
      });
    } else {
      if (!user.validPassword(req.body.password)) {
        return res.status(400).send({
          message: 'Wrong Password',
        });
      }

      const token = user.generateJWT();
      res.header('auth-token', token).json({
        error: null,
        data: {
          token,
        },
      });
    }
  });
};

exports.signup = (req, res) => {
  const newUser = new User();
  newUser.userId = req.body.userId;
  newUser.userName = req.body.userName;
  newUser.email = req.body.email;
  newUser.setPassword(req.body.password);

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
