const { statusCodeServerError } = require('../constants/statusCodeConstatns');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodeServerError;
  }
}

module.exports = ServerError;
