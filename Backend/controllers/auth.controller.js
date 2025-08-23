import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
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
    await sendVerificationEmail(newUser.email, verificationToken);
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
      return res
        .status(400)
        .json({ success: false, message: "Verification code is required" });
    }

    // Find the user by verification code and check expiration
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired verification code",
        });
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

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Server error. Please try again later.",
      });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Vérifier si email est confirmé (optionnel)
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Générer le token + cookie
    generateTokenAndSetCookie(res, user._id);

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Réponse finale
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
export const forgotPassword=async(req,res)=>{
  const {email}=req.body
  try {
    const user=await User.findOne({email})
    if(!user){
      return res.status(400).json({success:false,message:"User not found"})
    }
    const resetToken=crypto.randomBytes(20).toString('hex')
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 heure
    user.resetPasswordToken=resetToken
    user.resetPasswordExpiresAt=resetTokenExpiresAt
    await user.save()
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // le token est bien dans l'URL
    const { password } = req.body; // le nouveau mot de passe doit venir du body

    // Vérifier si l'utilisateur existe avec un token valide et non expiré
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Nettoyer les champs de reset pour éviter la réutilisation
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // Envoyer un email de confirmation
    await sendResetSuccessEmail(user.email);

    // Réponse au client
    res.status(200).json({ success: true, message: "Password has been reset successfully" });

  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Something went wrong, please try again later" });
  }
};


export const checkAuth = async (req, res) => {
  try {
    // On récupère l'utilisateur en excluant le mot de passe
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Si tout est ok, on renvoie les infos de l'utilisateur
    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Error in checkAuth:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // protection CSRF
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
