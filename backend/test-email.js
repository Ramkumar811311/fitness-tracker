require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: `"FitFusion" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "FitFusion SMTP Test",
      text: "Gmail SMTP is working!",
    });

    console.log("EMAIL SENT:", info.messageId);
  } catch (error) {
    console.error("SEND ERROR:", error);
  }
}

test();