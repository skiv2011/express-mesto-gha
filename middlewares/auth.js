const jwt = require('jsonwebtoken');
const AuthDataError = require('../errors/auth-err');

const auth = async (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  try {
    payload = jwt.verify(token, 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    next(new AuthDataError('Необходима авторизация.'));
  }
};

module.exports = { auth };
