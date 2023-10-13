const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  username,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello, ${username}</h4>
    ${message}
    `,
  }).catch(console.error);
};

module.exports = sendVerificationEmail;
