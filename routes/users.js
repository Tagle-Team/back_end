const express = require('express');
const router = express.Router();
const { signUp, confirmId } = require('../controllers/user.controller');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.route('/confirmId').get(confirmId);
router.route('/signup').post(signUp);

module.exports = router;
