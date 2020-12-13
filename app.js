const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5000'
};

// middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./app/models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch(err => {
    console.log('Cannot connect to the database.');
    process.exit();
  });

// route
app.get('/', (req, res) => {
  res.json({message: 'welcome to taggle.'});
});
require('./app/routes/user.routes')(app);

// listen
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

