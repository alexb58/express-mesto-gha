const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const isEmail = require('validator/lib/isEmail');
const isUrl = require('validator/lib/isURL');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'не передан e-mail пользователя'],
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'e-mail не соответствует формату',
      },
    },
    password: {
      type: String,
      required: [true, 'не передан пароль пользователя'],
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      minlength: [2, 'длина имени пользователя должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени пользователя должна быть не более 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'длина информации о себе должна быть не менее 2 символов'],
      maxlength: [30, 'длина информации о себе должна быть не более 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: (avatar) => isUrl(avatar, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'ссылка не соответствует формату',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true }, versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
