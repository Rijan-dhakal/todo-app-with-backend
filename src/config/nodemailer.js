import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export const accountEmail = process.env.MAIL_USER;

// Check if email password is available
const emailPassword = process.env.EMAIL_PASSWORD;
if (!emailPassword) {
  console.warn('WARNING: EMAIL_PASSWORD environment variable is not set');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: emailPassword
  }
});

// Verify the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Server connection error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

export default transporter;