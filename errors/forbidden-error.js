const { statusCodeForbidden } = require('../constants/statusCodeConstatns');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodeForbidden;
  }
}

module.exports = ForbiddenError;
