const router = require('express').Router(); // импортируем роутер из express
const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js

const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');

const { createUser, login, logout } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../middlewares/validators/userValidator');

router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);

router.use('/users', auth, users);
router.use('/cards', auth, cards);
router.get('/signout', auth, logout);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса'));
});

module.exports = router;
