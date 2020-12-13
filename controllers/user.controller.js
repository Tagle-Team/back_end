const crypto = require('crypto');
const { addUser, findUserByUserId } = require('../models/user');

const signUp = async (req, res) => {
  const { userId, password, name, mail } = req.body;
  let result = null;

  const saltBuf = crypto.randomBytes(64);
  const salt = saltBuf.toString('base64');

  const hashPasswordBuf = crypto.pbkdf2Sync(
    password,
    salt,
    100000,
    64,
    'sha512'
  );
  const hashPassword = hashPasswordBuf.toString('base64');

  const now = new Date();
  await addUser({
    userId,
    password,
    salt: hashPassword,
    name,
    mail,
    created: now,
    modified: now,
  })
    .then(() => {
      result = 'success';
    })
    .catch((error) => {
      console.log(error);
    });

  return res.send({ result });
};

const confirmId = async (req, res) => {
  const { id } = req.query;
  let result = false;

  await findUserByUserId(id)
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

module.exports = { signUp, confirmId };
