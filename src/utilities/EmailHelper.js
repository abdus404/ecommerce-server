const nodemailer = require("nodemailer");

const EmailSend = async (EmailTo, EmailSubject, EmailText) => {
  let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "abdusjscript@gmail.com",
      pass: "mhwg plsr wvyq gmbn",
    },
  });

  let mailOption = {
    from: "Abdus Samad <abdusjscript@gmail.com>",
    to: EmailTo,
    subject: EmailSubject,
    text: EmailText,
  };
  return await transport.sendMail(mailOption);
};

module.exports = EmailSend;
