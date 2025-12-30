const { messages } = require("../constents");

const errorHandler = (err, req, res, next) => {
  if (!err.statusCode) {
    if (err.name === "JsonWebTokenError") {
      err.message = `invalid signature!${messages[401]}`;
      err.statusCode = 401;
    }
    if (err.name === "TokenExpiredError") {
      err.message = `jwt expired!${messages[401]}`;
      err.statusCode = 401;
    }
    if (err.name === "ValidationError") {
      err.message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
      err.statusCode = 400;
    }
    if (err.name === "MongoServerError" && err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      err.message = `${field} ${messages[409]}`;
      err.statusCode = 409;
    }
  }
  return res.status(err.statusCode).json({
    message: err.message,
  });
};

module.exports = errorHandler;
