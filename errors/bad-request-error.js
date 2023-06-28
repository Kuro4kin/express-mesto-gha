const { statusCodeBadRequest } = require('../constants/statusCodeConstatns');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodeBadRequest;
  }
}

module.exports = BadRequestError;
