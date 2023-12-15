const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();

// Подключаем обработчики маршрутов для пользователей и карточек
const users = require('./users');

const cards = require('./cards');

const NotFoundError = require('../errors/NotFoundError');

const { createUser, login, logout } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../middlewares/validators/userValidator');

router.use('/', users);

router.post('/signup', createUserValidator, createUser);

router.post('/signin', loginValidator, login);

// Регистрируем маршруты для пользователей и карточек
router.use('/users', auth, users);
router.use('/cards', auth, cards);
router.get('/signout', auth, logout);

// Обработчик для случаев, когда запрашиваемый URL не существует
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый URL не существует'));
});

module.exports = router;
