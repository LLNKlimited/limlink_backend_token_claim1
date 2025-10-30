require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: `"rick@llnklimited.com" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.error('❌ Email send failed:', err);
    return { success: false, error: err.message };
  }
}

module.exports = { sendEmail };
