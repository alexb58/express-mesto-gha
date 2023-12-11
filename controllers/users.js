const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;

const User = require('../models/user');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

const getUserById = (req, res) => {
  console.log(req.params);
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Передан некорректный ID пользователя' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании пользователя: ${errorMessage}`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

const updateUserData = (req, res, updateOptions) => {
  const { _id: userId } = req.user;
  User.findByIdAndUpdate(
    userId,
    updateOptions,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при обновлении профиля: ${errorMessage}`,
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Передан некорректный ID пользователя' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

const updateProfile = (req, res) => {
  const updateOptions = req.body;
  updateUserData(req, res, updateOptions);
};

const updateAvatar = (req, res) => {
  const updateOptions = req.body;
  updateUserData(req, res, updateOptions);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};