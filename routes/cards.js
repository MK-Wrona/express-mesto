const cardRouter = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const auth = require('../middlewares/auth');

cardRouter.use(auth); // можно перейти по рутам ниже только в случае успешной авторизации

// руты для карточек\лойсов

cardRouter.get('/cards/', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:_id', deleteCard);
cardRouter.put('/cards/:_id/likes', likeCard);
cardRouter.delete('/cards/:_id/likes', dislikeCard);

module.exports = cardRouter;
