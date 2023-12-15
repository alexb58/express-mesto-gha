const mongoose = require('mongoose');

const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'не передано имя карточки'],
      minlength: [2, 'длина имени карточки должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени карточки должна быть не более 30 символов'],
    },
    link: {
      type: String,
      validate: {
        validator: (link) => isUrl(link, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'ссылка не соответствует формату',
      },
      required: [true, 'не передана ссылка на изображение'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
