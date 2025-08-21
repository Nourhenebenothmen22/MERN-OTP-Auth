// utils/emailSender.js
import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import dotenv from "dotenv";

dotenv.config();

// Créer un transporteur avec les credentials de votre inbox de test Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_INBOX_USER,
    pass: process.env.MAILTRAP_INBOX_PASS,
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: '"Votre Application" <no-reply@yourapp.com>',
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });

    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send verification email:", error.message);
    throw error;
  }
};