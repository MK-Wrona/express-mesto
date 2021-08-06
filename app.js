const express = require('express');

const app = express();
const mongoose = require('mongoose');
// const fs = require("fs")
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// middlewares
app.use(express.static(`${__dirname}/public`));
app.use(express.json());

// временная авторизация
app.use((req, res, next) => {
  req.user = {
    _id: '610cf6be5abc684a70ff67ba', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// sync
app.use('/', userRouter);
app.use('/', cardsRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is run at ${PORT}`);
});
