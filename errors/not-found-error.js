const { statusCodeNotFound } = require('../constants/statusCodeConstatns');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodeNotFound;
  }
}

module.exports = NotFoundError;
