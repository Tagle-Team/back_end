const express = require('express');
const router = express.Router();
const {
  addPost,
  getPosts,
  updatePrivate,
  updatePost,
  deletePost,
} = require('../controller/post.controller');
const { authMiddleware } = require('../middlewares/auth');

/* GET users listing. */
router.use('/', authMiddleware);
router.post('/', addPost);
router.get('/', getPosts);
router.put('/private', updatePrivate);
router.put('/:seq', updatePost);
router.delete('/:seq', deletePost);

module.exports = router;
