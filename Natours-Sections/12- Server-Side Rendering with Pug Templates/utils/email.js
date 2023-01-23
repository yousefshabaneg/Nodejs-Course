const nodemailer = require('nodemailer');

const sendEmail = async function(options) {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  });

  // 2) Define the email options.
  const mailOptions = {
    from: 'Natours: <egk.tik3@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html: convertTextToHtml
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
