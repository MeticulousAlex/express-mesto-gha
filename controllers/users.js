/* eslint-disable dot-notation */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const DuplicateError = require('../errors/DuplicateError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const JWT_SECRET = '8146dee8b1ee7e625099e7294b764571140877a0048d0885cf631910693f7921';

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((password) => User.create({
      name, about, avatar, email, password,
    }))
    .then((user) => {
      const userData = { ...user };
      delete userData._doc.password;
      res.status(201).send({ user: userData['_doc'] });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      if (err.name === 'MongoServerError') {
        throw new DuplicateError('Пользователь с таким email уже существует');
      }
    })
    .catch((err) => {
      next(err);
    });
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
  User.findUserByCredentials(email, password)
    .then((user) => {
      const userData = { ...user };
      delete userData._doc.password;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).status(200).send({ user: userData._doc });
    })
    .catch(() => {
      throw new UnauthorizedError('Ошибка авторизации');
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
