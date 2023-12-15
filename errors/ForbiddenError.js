class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_403;
  }
}

module.exports = ForbiddenError;