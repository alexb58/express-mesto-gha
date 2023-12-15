const { CONFLICT_409 } = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_409;
  }
}

module.exports = BadRequestError;
