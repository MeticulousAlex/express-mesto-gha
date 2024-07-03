const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.message === 'wrongUrl') {
        return next(new BadRequestError('Введены некорректные данные'));
      }

      return next(err);
    })
    .catch(next);
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params._id }).orFail(new Error('Карточка не найдена'))
    .then((foundCard) => {
      if (foundCard.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удалять чужие карточки запрещено');
      }
      Card.deleteOne(foundCard)
        .then((card) => res.status(200).send({ deletedCard: card }))
        .catch(next);
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        return next(new NotFoundError(err.message));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('Карточка не найдена'))
    .then((card) => res.status(200).send({ updatedCard: card }))
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        return next(new NotFoundError(err.message));
      }
      if (err.message === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }

      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true }).orFail(new Error('Карточка не найдена'))
    .then((card) => res.status(200).send({ updatedCard: card }))
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        return next(new NotFoundError(err.message));
      }
      if (err.message === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }

      return next(err);
    });
};
