const { messages } = require("./constents");

class CustomeError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = {
  AppError: CustomeError,
};
