const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const err = new UnauthorizedError('Authorization required');
    next(err);
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, 'verysecretword');
  } catch (e) {
    const err = new UnauthorizedError('Authorization required');
    next(err);
    return;
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
