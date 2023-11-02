const sendEmail = require("../utils/sendEmail");

const sendResetPasswordEmail = ({ username, email, origin, token }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;
  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${username}</h4>
   ${message}
   `,
  });
};

module.exports = sendResetPasswordEmail;
