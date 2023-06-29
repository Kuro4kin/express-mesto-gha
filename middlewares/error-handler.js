const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('../constants/statusCodeConstatns');

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error' });
  }
  next();
};

module.exports = errorHandler;
