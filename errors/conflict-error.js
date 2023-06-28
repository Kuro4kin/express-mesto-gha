const { statusCodeConflict } = require('../constants/statusCodeConstatns');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodeConflict;
  }
}

module.exports = ConflictError;
