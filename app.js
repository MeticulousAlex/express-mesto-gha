/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(('mongodb://127.0.0.1:27017/mestodb'), {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  cookies: Joi.object().keys({
    jwt: Joi.string(),
  }),
}), auth, require('./routes/users'));
app.use('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    owner: Joi.string().alphanum().length(24),
    likes: Joi.array().items(Joi.string().alphanum().length(24)),
    createdAt: Joi.date(),
  }),
}), auth, require('./routes/cards'));

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
