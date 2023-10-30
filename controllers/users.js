/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const { JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((password) => User.create({
      name, about, avatar, email, password,
    }))
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params._id).orFail(new Error('Пользователь с таким id не найден'))
    .then((user) => res.status(200).send({ userData: user }))
    .catch((err) => {
      if (err.message === 'Пользователь с таким id не найден') {
        throw new NotFoundError(err.message);
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Введён некорректный id пользователя');
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(new Error('Пользователь не найден'))
    .then((user) => res.status(200).send({ updatedProfile: user }))
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(new Error('Пользователь с таким id не найден'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'Пользователь с таким id не найден') {
        throw new NotFoundError(err.message);
      }
      if (err.name === 'ValidationError' || err.message === 'wrongUrl') {
        throw new BadRequestError('Введены некорректные данные');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .catch(next);
};

module.exports.getMyInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id }).orFail(new Error('Not found'))
    .then((user) => {
      res.status(200).send({ userData: user });
    })
    .catch((err) => {
      if (err.name === 'Not found') {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};
