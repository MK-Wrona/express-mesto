const userRouter = require('express').Router();
const {
  getUsers, getUser, createUser, updateAvatar, updateUser, getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:_id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);
userRouter.get('/me', getCurrentUser);

module.exports = userRouter;
