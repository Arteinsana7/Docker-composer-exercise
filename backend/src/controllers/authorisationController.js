import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserModel from "../models/UserModel.js";
import { catchAsync } from "../utils/middlewares/errorHandler.js";
import AppError from "../utils/AppError.js";
import { sendVerificationEmail } from "../services/emailService.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return next(new AppError("Cet email est déjà utilisé", 400));
  }

  // Create a user (not verified)
  const user = await UserModel.create({
    username,
    email,
    password,
    emailVerified: false,
  });

  // Generate verification token with native crypto
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  await user.save();

  // send email
  try {
    await sendVerificationEmail(email, username, verificationToken);
  } catch (error) {
    // if the email fails delete user
    await UserModel.findByIdAndDelete(user._id);
    return next(
      new AppError("Erreur lors de l'envoi de l'email de vérification", 500)
    );
  }

  // Do not give token JWT
  res.status(201).json({
    success: true,
    message:
      "Registration successful! Please check your email to verify your account.",
    email: user.email,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Veuillez fournir un email et un mot de passe", 400)
    );
  }

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Email ou mot de passe incorrect", 401));
  }

  // Verifies that the email is already verified
  if (!user.emailVerified) {
    return next(
      new AppError("Please verify your email before logging in", 403)
    );
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Connexion réussie",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("Utilisateur non trouvé", 404));
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc    Verify email with token
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  // Find the user with a the non expire token
  const user = await UserModel.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  }).select("+verificationToken +verificationTokenExpires");

  if (!user) {
    return next(new AppError("Invalid or expired verification token", 400));
  }

  // Vverify the email
  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully! You can now login.",
  });
});
