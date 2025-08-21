// utils/emailSender.js
import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import dotenv from "dotenv";
import { mailtrapClient, sender } from "./mailtrap.config.js";

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
