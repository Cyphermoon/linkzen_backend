const UnAunthenticatedError = require("../errors/unauthenticated");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const isUserAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAunthenticatedError("oops, you need to login");
  }

  const accessToken = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(accessToken, JWT_SECRET);
    if (!req.user) {
      req.user = {
        id: payload.id,
        username: payload.username,
        role: payload.role,
      };
    }
  } catch (err) {
    throw new UnAunthenticatedError("invalid authentication");
  }
};

module.exports = isUserAuthenticated;
