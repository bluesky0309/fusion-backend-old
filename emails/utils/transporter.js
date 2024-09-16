const nodemailer = require("nodemailer");

const handleEmailSender = async ({ receiver, html, subject }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: receiver,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending  email:", error.message);
  }
};

module.exports = {
  handleEmailSender,
};
