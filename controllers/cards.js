const { CastError, ValidationError } = require('mongoose').Error;

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const ForbiddenError = require('../errors/ForbiddenError');

const Card = require('../models/card');

const { CREATED_201 } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED_201).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        next(new BadRequestError(`Переданы некорректные данные при создании карточки: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (userId !== card.owner.toString()) {
        throw new ForbiddenError('К сожалению, Вы не можете удалить эту карточку');
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный ID карточки'));
      } else {
        next(err);
      }
    });
};

const changeLikeCardStatus = (req, res, next, likeOptions) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return Card.findByIdAndUpdate(cardId, likeOptions, { new: true })
        .then((cardForLike) => cardForLike.populate(['owner', 'likes']))
        .then((cardForLike) => { res.send(cardForLike); });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { _id: userId } = req.user;
  const likeOptions = { $addToSet: { likes: userId } };
  changeLikeCardStatus(req, res, next, likeOptions);
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
