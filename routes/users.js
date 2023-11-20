const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUser, updateProfile, updateAvatar, getMyInfo,
} = require('../controllers/users');

router.get('/', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
}), getAllUsers);

router.get('/me', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
}), getMyInfo);

router.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({
      scheme: [
        'http',
        'https',
      ],
    }),
  }),
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
}), updateAvatar);

module.exports = router;
