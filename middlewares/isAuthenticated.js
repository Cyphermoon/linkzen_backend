const UnAunthenticatedError = require("../errors/unauthenticated");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const isUserAuthenticated = (req, res, next) => {
  let accessToken;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    accessToken = authHeader.split(" ")[1];
    // check cookies
  } else if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  if (!accessToken) {
    throw new UnAunthenticatedError("invalid authentication");
  }
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

  next();
};

module.exports = isUserAuthenticated;
