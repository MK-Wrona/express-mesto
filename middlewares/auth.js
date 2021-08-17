const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth_error');

const JWT_SECRET = 'secret';

function auth(req, res, next) {
  const token = req.cookies.jwt;
  // console.log(req.cookies)
  // console.log(token); // {token: undefined}
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Авторизация не прошла.');
  }

  req.user = payload;

  next();
}

module.exports = auth;
