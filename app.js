const express = require('express');
const rateLimit = require('express-rate-limit');

const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const router = require('./routes/index');

const errorHandler = require('./middlewares/errorHandler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
const dbUrl = 'mongodb://localhost:27017/mestodb';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
