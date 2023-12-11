const mongoose = require('mongoose');

const nameOptions = {
  type: String,
  required: [true, 'не передано имя пользователя'],
  minlength: [2, 'длина имени пользователя должна быть не менее 2 символов'],
  maxlength: [30, 'длина имени пользователя должна быть не более 30 символов'],
};

const aboutOptions = {
  type: String,
  required: [true, 'не передано информации о пользователе'],
  minlength: [2, 'длина информации о себе должна быть не менее 2 символов'],
  maxlength: [30, 'длина информации о себе должна быть не более 30 символов'],
};

const avatarOptions = {
  type: String,
  required: [true, 'не передана ссылка на аватар пользователя'],
};

const userSchema = new mongoose.Schema(
  {
    name: nameOptions,
    about: aboutOptions,
    avatar: avatarOptions,
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
