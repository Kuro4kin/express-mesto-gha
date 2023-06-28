const { statusCodeUnauthorized } = require('../constants/statusCodeConstatns');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodeUnauthorized;
  }
}

module.exports = UnauthorizedError;
