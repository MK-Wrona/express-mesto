const router = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:_id', getUser);
router.post('/users', createUser);

module.exports = router;
