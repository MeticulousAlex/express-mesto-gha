const { celebrate, Joi } = require('celebrate');

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({
      scheme: [
        'http',
        'https',
      ],
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
});

module.exports = { signinValidation, signupValidation };
