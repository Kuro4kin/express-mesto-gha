const { HTTP_STATUS_BAD_REQUEST } = require('../constants/statusCodeConstatns');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
