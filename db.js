const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017');

const db = mongoose.connection;
db.on('error', console.error); // mongoDB 연동 실패 시 에러 메시지 출력
db.once('open', () => {
  console.log('connected to mongoDB server'); // mongoDB 연동 성공 시 메시지 출력
});
