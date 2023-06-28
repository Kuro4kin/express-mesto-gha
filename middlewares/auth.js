const jwt = require('jsonwebtoken');
const { statusCodeUnauthorized } = require('../constants/statusCodeConstatns');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(statusCodeUnauthorized).send({ message: 'Authorization required' });
  }
  let payload;
  try {
    payload = jwt.verify(token, 'verysecretword');
  } catch (err) {
    return res.status(statusCodeUnauthorized).send({ message: 'Authorization required' });
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
