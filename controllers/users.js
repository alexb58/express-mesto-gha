const { CastError, ValidationError } = require('mongoose').Error;

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

const { CREATED_201 } = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный ID пользователя'));
      } else {
        next(err);
      }
    });
};

const getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED_201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким e-mail уже существует'));
        return;
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        next(new BadRequestError(`Переданы некорректные данные: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

const updateUserData = (req, res, next, updateOptions) => {
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(userId, updateOptions, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        next(new BadRequestError(`Переданы некорректные данные при создании пользователя: ${errorMessage}`));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный ID пользователя'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      })
        .send({ token });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из системы' });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const updateOptions = { name, about };
  updateUserData(req, res, next, updateOptions);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const updateOptions = { avatar };
  updateUserData(req, res, next, updateOptions);
};

module.exports = {
  getUsers,
  getCurrentUserInfo,
  getUserById,
  createUser,
  login,
  logout,
  updateProfile,
  updateAvatar,
};
