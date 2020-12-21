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

/* 
  "/post" 하위 routes
  /post
  /post/private
  /post/3 
  ....
*/
/* 로그인한 사용자를 위한 서비스로 /post모든 요청 전에 authMiddleware 가 실행되어
유효한 jwt토큰인지 판단 */
router.use('/', authMiddleware);
/* post 등록 */
router.post('/', addPost);
/* 로그인한 사용자가 작성한, 삭제되지 않은 게시글 반환 */
router.get('/', getPosts);
/* 공개 여부 변경 api */
router.put('/private', updatePrivate);
/* 게시글 수정 */
router.put('/:id', updatePost);
/* 게시글 삭제 */
router.delete('/:id', deletePost);

module.exports = router;
