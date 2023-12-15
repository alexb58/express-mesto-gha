const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();

const { NOT_FOUND_404 } = require('../utils/constants');

// Подключаем обработчики маршрутов для пользователей и карточек
const users = require('./users');

const cards = require('./cards');

const { createUser, login } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../middlewares/validators/userValidator');

router.use('/', users);

router.post('/signup', createUserValidator, createUser);

router.post('/signin', loginValidator, login);

// Регистрируем маршруты для пользователей и карточек
router.use('/users', auth, users);
router.use('/cards', auth, cards);

// Обработчик для случаев, когда запрашиваемый URL не существует
router.use('*', (req, res) => {
  res.status(NOT_FOUND_404).send({ message: 'Запрашиваемый URL не существует' });
});

module.exports = router;
