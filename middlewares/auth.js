const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const JWT_SECRET = '8146dee8b1ee7e625099e7294b764571140877a0048d0885cf631910693f7921';

module.exports = (req, res, next) => {
  const jwtToken = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(jwtToken, JWT_SECRET);
    if (!payload) {
      throw new UnauthorizedError('Необходима авторизация');
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Необходима авторизация');
    }
    next(err);
  }
  req.user = payload;

  next();
};
