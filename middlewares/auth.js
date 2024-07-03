const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const jwtToken = req.cookies.jwt.replace('jwt=', '');

  let payload;

  try {
    payload = jwt.verify(jwtToken, JWT_SECRET);
    if (!payload) {
      throw new UnauthorizedError(`${jwtToken}`);
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('плохой токен'); // Необходима авторизация
    }
    next(err);
  }
  req.user = payload;

  next();
};
