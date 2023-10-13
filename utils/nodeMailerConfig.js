require("dotenv").config();

module.exports = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.LINKZEN_HOST_EMAIL,
    pass: process.env.LINKZEN_EMAIL_PASSWORD,
    s,
  },
};
