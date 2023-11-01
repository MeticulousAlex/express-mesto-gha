const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getAllCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({
      scheme: [
        'http',
        'https',
      ],
    }),
  }),
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
}), createCard);
router.get('/', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
}), getAllCards);
router.delete('/:_id', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
router.put('/:_id/likes', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), likeCard);
router.delete('/:_id/likes', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
