import jwt from "jsonwebtoken";
import UserModel from "../../models/UserModel.js";
import { catchAsync } from "./errorHandler.js";
import AppError from "../AppError.js";

/**
 * Middleware for protecting routes
 * Verifies JWT token and loads user into req.user
 */
export const protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;

  // Extract token from "Bearer TOKEN" format
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return next(new AppError("Non autorisé, token manquant", 401));
  }

  // Verify token (jwt.verify automatically throws error if invalid/expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Load user from database
  req.user = await UserModel.findById(decoded.id).select("-password");

  // Check if user still exists
  if (!req.user) {
    return next(new AppError("Utilisateur non trouvé", 401));
  }

  next();
});
