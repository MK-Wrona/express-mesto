const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DataError = require('../errors/data_error'); // 400
const AuthError = require('../errors/auth_error'); // 401
const ConflictError = require('../errors/conflict_error'); // 409
const NotFoundError = require('../errors/not_found_error'); // 404

const { NODE_ENV } = process.env;

const { JWT_SECRET = 'secret' } = process.env; // подпись

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => res.status(500).send(err));

const getUser = (req, res, next) => User.findById(req.params._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Юзер по заданному ID отсутствует в БД.');
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new DataError('Неверный запрос или данные.');
    }
  })
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log({ message: err });
      if (err.name === 'ValidationError') {
        throw new DataError('Неверный запрос или данные.');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Данный почтовый ящик уже используется.');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  // нашли значение у пользователя по id, обновили и отправили обратно
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Юзер по заданному ID отсутствует в БД.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new DataError('Неверный запрос или данные.');
      }
      throw new NotFoundError('Запрашиваемый ресурс не найден.');
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // нашли значение у пользователя по id, обновили
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  // вернули
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Юзер по заданному ID отсутствует в БД.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные внесены некорректно.' });
      }
      throw new NotFoundError('Запрашиваемый ресурс не найден.');
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        // передаем в пейлоуд айди юзера и подпись
        { _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
      }).end(res.send({ message: 'Записано.' }));
      // console.log(res.cookie);
      // .send({ token });
    })
    .catch(() => next(new AuthError('Возинкла ошибка авторизации.')));
};

const getCurrentUser = (req, res, next) => User.findById(req.params._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Юзер по заданному ID отсутствует в БД.');
    }
    res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new NotFoundError('Юзер по заданному ID отсутствует в БД.');
    } else {
      next(err);
    }
  })
  .catch(next);

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
