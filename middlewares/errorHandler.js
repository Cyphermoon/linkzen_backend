const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let errors = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err.name === "ValidationError") {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    errors.statusCode = 400;
    errors.msg = err.name;
  }

  // duplicate email error
  if (err.code && err.code === 11000) {
    errors.msg = `sorry, user with this ${Object.keys(
      err.keyValue
    )} already exists, please choose another ${Object.keys(err.keyValue)}`;
    errors.statusCode = 400;
  }

  if (err.name === "CastError") {
    errors.message = err.message;
  }
  // remove status code from the errors object
  const { statusCode, ...details } = errors;

  return res
    .status(errors.statusCode)
    .json({ success: false, errors: details });
};

module.exports = errorHandlerMiddleware;
