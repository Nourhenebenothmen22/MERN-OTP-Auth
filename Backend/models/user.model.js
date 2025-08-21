import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // supprime les espaces en trop
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // force en minuscule
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // bonne pratique
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false, // par défaut, l’utilisateur n’est pas vérifié
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true } // crée createdAt et updatedAt automatiquement
);

const User = mongoose.model("User", userSchema);

export default User;
