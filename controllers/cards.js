const Card = require('../models/card');

// получить все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточки с данным ID нет в БД.' });
        return;
      }
      // получили и сразу отправили юзеру
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные внесены некорректно.' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден.' });
    });
};

// через post добавили в бд
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные внесены некорректно.' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Пользователя с данным ID нет в БД.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id, {
      $addToSet: { likes: req.params._id },
    }, { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Пользователя с данным ID нет в БД.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные внесены некорректно.' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      $pull: { likes: req.params._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Пользователя с данным ID нет в БД.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточки с данным ID нет в БД.' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден.' });
    });
};
