const userRouter = require('express').Router();
const {
  getUsers, getUser, createUser, updateAvatar, updateUser, getCurrentUser, // login,
} = require('../controllers/users');
// const auth = require('../middlewares/auth');

// userRouter.use(auth); // можно перейти по рутам ниже только в случае успешной авторизации

userRouter.get('/users', getUsers);
userRouter.get('/users/:_id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);
userRouter.get('/me', getCurrentUser);

module.exports = userRouter;
