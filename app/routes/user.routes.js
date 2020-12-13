module.exports = app => {
  const user = require('../controller/user.controller.js');
  const router = require('express').Router();

  router.post("/login", user.login);
  router.post("/signup", user.signup);
  app.use('/api/user', router);
}
