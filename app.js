const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const router = require('./routes/index');

const app = express();
const dbUrl = 'mongodb://localhost:27017/mestodb';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware для установки фиктивного пользователя в запросе
app.use((req, res, next) => {
  req.user = {
    _id: '6439cc795a2a1fb8080e67ce',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});