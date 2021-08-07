const Card = require('../models/card');

// получить все карточки
const getCards = (req, res) => {
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
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Данные не валидны.' });
      }
      return res.status(500).send(err);
    });
};

const deleteCard = (req, res) => {
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id, {
      // добавляем id юзера в качестве лайка
      $addToSet: { likes: req.user._id },
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      // убираем id из массива лайков
      $pull: { likes: req.user._id },
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

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
