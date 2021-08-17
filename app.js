require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// const fs = require("fs")
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const NotFoundError = require('./errors/not_found_error'); // 404

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// middlewares
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

// sync
app.use('/', userRouter);
app.use('/', cardsRouter);
// запрос по несуществующему руту
app.use('*', () => { throw new NotFoundError('Запрашиваемый ресурс не найден.'); });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is run at ${PORT}`);
});
