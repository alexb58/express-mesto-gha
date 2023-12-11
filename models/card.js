const mongoose = require('mongoose');

const nameOptions = {
  type: String,
  required: [true, 'не передано имя карточки'],
  minlength: [2, 'длина имени карточки должна быть не менее 2 символов'],
  maxlength: [30, 'длина имени карточки должна быть не более 30 символов'],
};

const linkOptions = {
  type: String,
  required: [true, 'не передана ссылка на изображение'],
};

const ownerOptions = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',
  required: true,
};

const likesOptions = {
  type: [mongoose.Schema.Types.ObjectId],
  ref: 'user',
  default: [],
};

const createdAtOptions = {
  type: Date,
  default: Date.now,
};

const cardSchema = new mongoose.Schema({
  name: nameOptions,
  link: linkOptions,
  owner: ownerOptions,
  likes: likesOptions,
  createdAt: createdAtOptions,
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
