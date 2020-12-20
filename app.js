const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { secret } = require('./app/config');
const usersRouter = require('./app/routes/user.routes');
const boardRouter = require('./app/routes/board.routes');
const listRouter = require('./app/routes/list.routes');
const cardRouter = require('./app/routes/card.routes');
const postRouter = require('./app/routes/post.routes');

const app = express();

/* cors 정책에 로컬호스트 5000번 추가 */
const corsOptions = {
  origin: 'http://localhost:5000',
};

/* jwt 암호화 키 값 설정 */
app.set('jwt-secret', secret);

/* 정적자원 설정 */
app.set('static', __dirname);
app.use('/static', express.static(__dirname + '/uploads'));

// middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');

/* MongoDB 연결 */
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch((err) => {
    console.log('Cannot connect to the database.');
    process.exit();
  });

/* 라우팅 정의 */
app.get('/', (req, res) => {
  res.json({ message: 'welcome to taggle.' });
});
app.use('/users', usersRouter);
app.use('/boards', boardRouter);
app.use('/lists', listRouter);
app.use('/cards', cardRouter);
app.use('/post', postRouter);

/* listen */
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
