const CustomError = require("./custom_error");
const { StatusCodes } = require("http-status-codes");

class UnAunthenticatedError extends CustomError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnAunthenticatedError;
