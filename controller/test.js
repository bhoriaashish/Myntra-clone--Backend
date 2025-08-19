require('dotenv').config();
const nodemailer = require('nodemailer');


console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "LOADED" : "MISSING");

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,   // your email
        pass: process.env.EMAIL_PASSWORD,   // your app password
        }
});
const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // send to your own email to check
        subject: 'Test Email from Nodemailer',
        text: 'This is a test email to verify EMAIL_USER and EMAIL_PASS.',
      };
  
    transporter.sendMail(mailOptions);
    console.log('Email sent successfully:');
