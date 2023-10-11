const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let errors = {};
  if (err.name === "ValidationError") {
    errors.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    errors.statusCode = 400;
  }
  return res.status(errors.statusCode).json({ msg: errors.msg });
};

module.exports = errorHandlerMiddleware;
