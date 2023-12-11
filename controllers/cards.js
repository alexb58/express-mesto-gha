const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;

const Card = require('../models/card');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки: ${errorMessage}`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
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

const changeLikeCardStatus = (req, res, likeOtpions) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, likeOtpions, { new: true })
    .orFail()
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return;
      }
      if (err instanceof DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

const likeCard = (req, res) => {
  const { _id: userId } = req.user;
  const likeOptions = { $addToSet: { likes: userId } };
  changeLikeCardStatus(req, res, likeOptions);
};

const dislikeCard = (req, res) => {
  const { _id: userId } = req.user;
  const likeOptions = { $pull: { likes: userId } };
  changeLikeCardStatus(req, res, likeOptions);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};