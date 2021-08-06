const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => res.status(500).send(err));

const getUser = (req, res) => User.findById(req.params._id)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователя с данным ID нет в БД.' });
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'ID юзера не валиден.' });
    }
    return res.status(500).send(err);
  });

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Данные внесены некорректно.' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден.' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  // нашли значение у пользователя по id, обновили и отправили обратно
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, upsert: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Данные внесены некорректно.' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден.' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // нашли значение у пользователя по id, обновили
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
  // вернули
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные внесены некорректно.' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден.' });
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
