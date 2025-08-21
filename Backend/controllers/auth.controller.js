import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Vérifier si l'utilisateur existe déjà
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    // Hashage du mot de passe (12 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    // Créer un nouvel utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expire dans 24h
    });
   generateTokenAndSetCookie(res, newUser._id);
await sendVerificationEmail(newUser.email,verificationToken)
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body; // Extract verification code

  try {
    if (!code) {
      return res.status(400).json({ success: false, message: "Verification code is required" });
    }

    // Find the user by verification code and check expiration
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    // Update user fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    
    await user.save();

    // Send welcome email if the function exists
    if (sendWelcomeEmail) {
      await sendWelcomeEmail(user.email, user.name);
    }

    res.status(200).json({ success: true, message: "Email verified successfully!" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {};
export const logout = async (req, res) => {};
