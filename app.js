const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// const fs = require("fs")
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const login = require('./controllers/users');
const createUser = require('./controllers/users');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// middlewares
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

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
// запрос по несуществующему руту
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден.' }));
app.use(auth);

app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is run at ${PORT}`);
});
