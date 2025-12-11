import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import { catchAsync } from "../utils/middlewares/errorHandler.js";
import AppError from "../utils/AppError.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export const register = catchAsync(async (req, res, next) => {
  const { nom, email, password } = req.body;

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return next(new AppError("Cet email est déjà utilisé", 400));
  }

  const user = await UserModel.create({ nom, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      nom: user.nom,
      email: user.email,
    },
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

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Connexion réussie",
    token,
    user: {
      id: user._id,
      nom: user.nom,
      email: user.email,
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
      nom: user.nom,
      email: user.email,
    },
  });
});
