const express = require('express');
const router = express.Router();
const {
  signup,
  confirmId,
  login,
  signOut,
} = require('../controller/user.controller');
const { authMiddleware } = require('../middlewares/auth');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatar');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.userId + '_' + file.originalname);
  },
});
const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', login);
router.post('/signout', signOut);
router.get('/confirmId', confirmId);
router.post('/signup', upload.single('avatar'), signup);
router.use('/', authMiddleware);

module.exports = router;
