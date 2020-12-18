const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter = require('./app/routes/user.routes');
const boardRouter = require('./app/routes/board.routes');
const listRouter = require('./app/routes/list.routes');
const cardRouter = require('./app/routes/card.routes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5000',
};

// middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
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

// route
app.get('/', (req, res) => {
  res.json({ message: 'welcome to taggle.' });
});
app.use('/users', usersRouter);
app.use('/boards', boardRouter);
app.use('/lists', listRouter);
app.use('/cards', cardRouter);

// listen
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
