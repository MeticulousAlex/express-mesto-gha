/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const jwtToken = req.cookies.jwt;
  const token = jwtToken.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
      throw new UnauthorizedError('Необходима авторизация');
    }
  } catch (err) {
    next(err);
  }
  req.user = payload;

  next();
};
