const errorCodes = require('../utils/ErrorCodes');
const UserNotFoundError = require('../utils/UserNotFoundError');
const User = require("../models/user");



module.exports.getUsers = (req, res) => { //модуль создания пользователя
  User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res
      .status(errorCodes.DEFAULT_ERROR)
      .send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new UserNotFoundError();
        res.send({ data: user });
      })
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(errorCodes.BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при поиске профиля.',
    });
    return;
      }
      res
        .status(errorCodes.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
  };


module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorCodes.BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании пользователя.',
          });
        return;
      }
      res
        .status(errorCodes.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => { //замена данных профиля
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    {
    name,
    about,
  },
  {
    new: true,
    runValidators: true,
  })
  .then((user) => {
    if (!user) throw new UserNotFoundError();
    res.send({ data: user });
  })
  .catch((err) => {
    if (err instanceof UserNotFoundError) {
      res.status(err.code).send({ message: err.message });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(errorCodes.BAD_REQUEST_ERROR).send({
        message: 'Переданы некорректные данные при обновлении профиля.',
        });
      return;
    }
    if (err.name === 'CastError') {
      res.status(errorCodes.BAD_REQUEST_ERROR).send({
        message: 'Переданы некорректные данные при поиске профиля.',
      });
      return;
      }
      res.status(errorCodes.DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
  });
};

module.exports.updateAvatar = (req, res) => { //замена аватара
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
     { avatar },
     {
    new: true,
    runValidators: true,
  })
  .then((user) => {
    if (!user) throw new UserNotFoundError();
    res.send({ data: user });
  })
  .catch((err) => {
    if (err instanceof UserNotFoundError) {
      res.status(err.code).send({ message: err.message });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(errorCodes.BAD_REQUEST_ERROR).send({
        message: 'Переданы некорректные данные при обновлении аватара.',
        });
      return;
    }
    if (err.name === 'CastError') {
      res.status(errorCodes.BAD_REQUEST_ERROR).send({
        message: 'Переданы некорректные данные при поиске профиля.',
      });
      return;
    }
    res.status(errorCodes.DEFAULT_ERROR).send({ message: "Произошла ошибка" });
  });
};
