const NODE_ENV = process.env.NODE_ENV;

const maxAge = 30 * 24 * 60 * 60 * 1000;

const attachTokenToResponse = (res, token) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: NODE_ENV === "development" ? false : true,
    expires: new Date(Date.now() + maxAge),
    sameSite: "Strict",
  });
};

const removeTokenFromResponse = (res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: NODE_ENV === "development" ? false : true,
  });
};

module.exports = { attachTokenToResponse, removeTokenFromResponse };
