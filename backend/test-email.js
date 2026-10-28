const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Using Email:', process.env.EMAIL);
console.log('Using Pass:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'undefined');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.EMAIL,
  to: process.env.EMAIL,
  subject: 'Test Email from iNoteBook Test Script',
  text: 'If you receive this, the email credentials and nodemailer service are working correctly!'
})
.then(info => {
  console.log('Email sent successfully:', info.response);
  process.exit(0);
})
.catch(err => {
  console.error('Error sending email:', err);
  process.exit(1);
});
