const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.message === 'wrongUrl') {
        return res.status(400).send({ message: 'Введены некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка вывода карточек' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(new Error('Карточка не найдена'))
    .then((card) => res.status(200).send({ deletedCard: card }))
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('Карточка не найдена'))
    .then((card) => res.status(200).send({ updatedCard: card }))
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Введены некорректные данные' });
      }
      return res.status(500).send({ message: 'Лайк не был поставлен' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true }).orFail(new Error('Карточка не найдена'))
    .then((card) => res.status(200).send({ updatedCard: card }))
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Введены некорректные данные' });
      }
      return res.status(500).send({ message: 'Лайк не был снят' });
    });
};
