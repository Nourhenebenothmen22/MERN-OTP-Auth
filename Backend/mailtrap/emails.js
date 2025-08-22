// utils/emailSender.js
import nodemailer from "nodemailer";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
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
export const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: '"Votre Application" <no-reply@yourapp.com>',
      to: email,
      subject: "Bienvenue sur notre plateforme !",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Bienvenue</title>
        </head>
        <body>
          <h1>Bienvenue, ${name} !</h1>
          <p>Merci d'avoir vérifié votre email. Votre compte est maintenant activé.</p>
        </body>
        </html>
      `,
    });

    console.log("Email de bienvenue envoyé: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email de bienvenue:", error.message);
    throw error;
  }
};
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const info = await transporter.sendMail({
      from: '"Your Application" <no-reply@yourapp.com>',
      to: email,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{ResetURL}", resetURL),
      headers: { "X-Category": "Password Reset" } // optional, if you want to keep a category
    });

    console.log("📩 Password reset email sent to %s (ID: %s)", email, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error while sending the password reset email:", error.message);
    throw error;
  }
};
export const sendResetSuccessEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: '"Your Application" <no-reply@yourapp.com>',
      to: email,
      subject: "Your password has been reset successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{email}", email), // si tu veux personnaliser avec l'email
      headers: { "X-Category": "Password Reset Success" } // optional
    });

    console.log("📩 Password reset success email sent to %s (ID: %s)", email, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error while sending the password reset success email:", error.message);
    throw error;
  }
};



