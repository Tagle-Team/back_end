const db = require('../models');
const User = db.user;
const fs = require('fs');

/* 로그인 */
exports.login = async (req, res) => {
  const { userId, password: inputPassword } = req.body;
  let result = false;
  let userInfo = {};

  /* userId로 회원 찾고 password 일치하는지 확인 */
  await User.findOne({ userId }, (err, user) => {
    if (user !== null && user.validPassword(inputPassword)) {
      const { userName, email, image } = user.toJSON();
      result = true;
      userInfo = {
        userName,
        email,
        image,
      };
      /* 일치하는 경우 jwt를 header에 set-cookie 로 설정 */
      /* header에 set-cookie 로 설정 할 경우 해당 api에 발급 받은 토큰 값을
       Cookie 값으로 알아서 브라우저가 담아서 보냄  */
      const token = user.generateJWT();
      /* httpOnly 옵션으로 javascript 에서 토큰에 접근 할 수 없도록 설정함 */
      res.cookie('token', token, { httpOnly: true });
    }
  });

  return res.send({ result, userInfo });
};

/* 로그아웃 */
exports.signOut = (req, res, next) => {
  res.locals.jwtPayload = null;
  res.cookie('token', null);
  res.status(204);

  return res.send();
};

/* 회원가입 */
exports.signup = (req, res) => {
  /* multer에서 파일을 업로드 한 경우 req에 file 값 존재  */
  const { file } = req;
  const newUser = new User();
  newUser.userId = req.body.userId;
  newUser.userName = req.body.userName;
  newUser.email = req.body.email;
  newUser.setPassword(req.body.password);

  /* 프로필 사진 업로드 한 경우 upload한 파일 이름 user > image 에 넣음 */
  if (!!file && file.filename) {
    newUser.image = file.filename;
  }

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

/* userId 중복 체크 */
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

/* 로그인한 user 비밀번호 확인 */
exports.confirmUser = async (req, res) => {
  const { password } = req.body;
  const { userId } = res.locals.jwtPayload;
  let result = false;
  let message = null;
  let userInfo = {};

  try {
    const user = await User.findOne({ userId });
    /* 로그인한 유저의 비밀번호가 일치할 경우 */
    if (user.validPassword(password)) {
      const { userId, userName, email, image, admin } = user.toJSON();
      result = true;

      userInfo = {
        userId,
        userName,
        email,
        image,
        admin,
      };
    }
  } catch (err) {
    message = err;
  }

  return res.send({ result, message, userInfo });
};

/* 사용자 정보 수정 */
exports.editUser = async (req, res) => {
  const { file } = req;
  const {
    userId,
    userName,
    email,
    password,
    isChangeAvatar = false,
    image,
  } = req.body;
  let result = false;
  let userInfo = {};

  /* 수정할 사용자 */
  const newUser = await User.findOne({ userId });
  newUser.userId = userId;
  newUser.userName = userName;
  newUser.email = email;
  newUser.setPassword(password);
  newUser.updateAt = new Date();

  /* 프로필 사진 변경 하는 경우 */
  if (isChangeAvatar === 'true') {
    try {
      const staticPath = req.app.get('static');
      /* 기존 사용자 프로필 사진 제거 */
      const path = `${staticPath}/uploads/avatar/${image}`;
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
        }

        console.log('avatar deleted');
      });
    } catch (err) {
      console.error(err);
    }
  }

  /* 프로필 사진 변경 하거나 제거한 경우 user.image 수정 */
  if (!!file && file.filename) {
    newUser.image = file.filename;
  } else if (isChangeAvatar) {
    newUser.image = null;
  }

  const user = await newUser.save();

  if (!!user) {
    result = true;
    const { userId, userName, email, image, admin } = user;

    userInfo = {
      userId,
      userName,
      email,
      image,
      admin,
    };
  }
  return res.send({ result, userInfo });
};
