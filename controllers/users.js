const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Введены некорректные данные' });
      }
      return res.status(500).send({ message: err.name });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка вывода пользователей' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id).orFail(new Error('Пользователь не найден'))
    .then((user) => res.status(200).send({ userData: user }))
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Ошибка вывода пользователя' });
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(new Error('Пользователь не найден'))
    .then((user) => res.status(200).send({ updatedProfile: user }))
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        return res.status(404).send({ message: err.message });
      }
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Введены некорректные данные' });
      }
      return res.status(500).send({ message: 'Данные не были обновлены' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,

  }).orFail(new Error('Пользователь не найден'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'ValidationError' || err.message === 'wrongUrl') {
        return res.status(400).send({ message: 'Введены некорректные данные' });
      }
      return res.status(500).send(err);
    });
};
