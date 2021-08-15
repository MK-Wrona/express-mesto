const Card = require('../models/card');

const DataError = require('../errors/data_error'); // 400
const AccessDeniedError = require('../errors/access_denied_error'); // 403
const NotFoundError = require('../errors/not_found_error'); // 404

// получить все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      // получили и сразу отправили юзеру
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataError('Данные карточки не валидны.');
      }
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
        throw new DataError('Данные карточки не валидны.');
      }
    });
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      } if (card.owner.toString() !== userId) {
        next(new AccessDeniedError('Недостаточно прав для удаления карточки.'));// 403
        return;
      }
      res.send(card);// deleteOne() ??
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Карточка не найдена.');
      }
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
        throw new NotFoundError('Карточка не найдена.');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataError('Данные карточки не валидны.');
      }
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
        throw new NotFoundError('Карточка не найдена.');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Карточка не найдена.');
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
