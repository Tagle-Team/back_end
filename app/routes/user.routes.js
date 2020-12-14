const express = require('express');
const router = express.Router();
const { signup, confirmId, login } = require('../controller/user.controller');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', login);
router.get('/confirmId', confirmId);
router.post('/signup', signup);

module.exports = router;
