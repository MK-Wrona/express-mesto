const cardRouter = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// руты для карточек\лойсов

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:_id', deleteCard);
cardRouter.put('/:_id/likes', likeCard);
cardRouter.delete('/:_id/likes', dislikeCard);

module.exports = cardRouter;
