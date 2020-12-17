const express = require('express');
const router = express.Router();
const { example } = require('../controller/tag.controller');

router.post('/example', example);

module.exports = router;
