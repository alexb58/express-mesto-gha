const express = require('express');
const router = express.Router();
const { HTTP_STATUS_NOT_FOUND } = require('../utils/constants');

// Подключаем обработчики маршрутов для пользователей и карточек
const users = require('./users');
const cards = require('./cards');

// Регистрируем маршруты для пользователей и карточек
router.use('/users', users);
router.use('/cards', cards);

// Обработчик для случаев, когда запрашиваемый URL не существует
router.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый URL не существует' });
});

module.exports = router;