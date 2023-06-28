const { statusCodeServerError } = require('../constants/statusCodeConstatns');

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(statusCodeServerError).send({ message: 'Server error fuck' });
  }
  next();
};

module.exports = errorHandler;
