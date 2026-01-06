import UserModel from "../models/UserModel.js";
import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import { catchAsync } from "../utils/middlewares/errorHandler.js";
import AppError from "../utils/AppError.js";

import crypto from "crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "../services/emailService.js";

export const updateProfile = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;

  // Check if the email exits
  if (email && email !== req.user.email) {
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return next(new AppError("Cet email est déjà utilisé", 400));
    }
  }

  // Update user
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    { username, email },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: "Profil mis à jour",
    user: {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});

/*
 * @desc Delete account
 * @route Delete/api/users/me
 * @access private access
 */

export async function deleteAccount(req, res) {
  try {
    // Delete user's data
    await Comment.deleteMany({ author: req.user._id });
    await Article.deleteMany({ author: req.user._id });
    await UserModel.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
}

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await UserModel.findById(req.user._id).select("+password");

  // Check actual password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError("Mot de passe actuel incorrect", 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Mot de passe mis à jour",
  });
});

/**
 * @desc    Request password reset
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("L'email est obligatoire", 400));
  }

  // Trouve l'utilisateur
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new AppError("Aucun compte n'existe avec cet email", 404));
  }

  // Génère un token unique
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash le token avant de le sauvegarder
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Sauvegarde le token hashé et l'expiration (1 heure)
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
  await user.save();

  // Envoie l'email via le service
  await sendPasswordResetEmail(email, user.username, resetToken);

  res.status(200).json({
    success: true,
    message: "Email de réinitialisation envoyé avec succès",
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/users/reset-password/:token
 * @access  Public
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return next(new AppError("Le mot de passe est obligatoire", 400));
  }

  if (password.length < 6) {
    return next(
      new AppError("Le mot de passe doit contenir au moins 6 caractères", 400)
    );
  }

  // Hash le token reçu pour comparer avec celui en DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Trouve l'utilisateur avec ce token ET vérifie qu'il n'est pas expiré
  const user = await UserModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token invalide ou expiré", 400));
  }

  // Change  password (will be save by the pre-save hook)
  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  // Email de confirmation via le service
  await sendPasswordChangedEmail(user.email, user.username);

  res.status(200).json({
    success: true,
    message: "Mot de passe réinitialisé avec succès",
  });
});
