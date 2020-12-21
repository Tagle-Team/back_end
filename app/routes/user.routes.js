const express = require('express');
const router = express.Router();
const {
  signup,
  confirmId,
  login,
  signOut,
  confirmUser,
  editUser,
} = require('../controller/user.controller');
const { authMiddleware } = require('../middlewares/auth');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    /* 사용자 프로필 사진 업로드 위치 */
    cb(null, 'uploads/avatar');
  },
  filename: (req, file, cb) => {
    /* 사용자 프로필 사진 파일명 unique 한 값 생성 */
    cb(
      null,
      new Date().valueOf() + '_' + req.body.userId + '_' + file.originalname
    );
  },
});
const upload = multer({ storage: storage });

/**
 * /users/login
 * /users/signout
 * /users/confirmId ...
 */

/* 로그인 api */
router.post('/login', login);
/* 로그아웃 */
router.post('/signout', signOut);
/* id 중복 체크 */
router.get('/confirmId', confirmId);
/* 회원 가입 하면서 avatar 이름으로 넘어오는 file upload 하는 미들웨어 실행 후 signup controller 실행  */
router.post('/signup', upload.single('avatar'), signup);
/* /users/confirm, /users/eidt 모두 로그인한 사용자를 위한 api 이므로 jwt 인증 확인 절차 미들웨어 추가 */
router.use('/', authMiddleware);
/* 로그인한 사용자의 비밀번호 확인 api */
router.post('/confirm', confirmUser);
/* 사용자 정보 수정, avatar 파일 업로드 하는 경우 upload 실행 후 editUser controller 실행 */
router.post('/edit', upload.single('avatar'), editUser);

module.exports = router;
