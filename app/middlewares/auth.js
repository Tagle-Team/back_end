const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (req, res, next) => {
  // read the token from header or url
  let token = req.headers.cookie || req.query.token;
  let jwtPayload;

  // token dose not exist
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'not logged in',
    });
  } else if (token.indexOf('token=') !== -1) {
    token = token.split('token=')[1];
  }

  try {
    jwtPayload = jwt.verify(token, req.app.get('jwt-secret'));
    res.locals.jwtPayload = jwtPayload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        resultCode: 401,
        meesage: '토큰 만료',
      });
    }

    return res.status(401).json({
      resultCode: 401,
      message: '토큰이 유효하지 않습니다.',
    });
  }

  const { id, userId, userName } = jwtPayload;
  const newToken = jwt.sign(
    { id, userId, userName },
    req.app.get('jwt-secret'),
    {
      expiresIn: '1h',
      subject: 'userInfo',
    }
  );

  res.cookie('token', newToken, { httpOnly: true });
  next();
};
