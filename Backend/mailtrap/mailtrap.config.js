import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};

client
  .send({
    from: sender,
    to: [{ email: "benothmennourhen8@gmail.com" }],
    subject: "Test Email",
    text: "This is a test email",
    category: "Test",
  })
  .then((response) => {
    console.log("Email sent successfully:", response);
  })
  .catch((error) => {
    console.error("Error sending email:", error.message);
  });