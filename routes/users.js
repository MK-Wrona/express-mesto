const userRouter = require('express').Router();
const {
  getUsers, getUser, createUser, updateAvatar, updateUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:_id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
