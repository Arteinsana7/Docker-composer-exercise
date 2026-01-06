import express from "express";
import {
  register,
  login,
  getMe,
  verifyEmail,
} from "../controllers/authorisationController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

import { protect } from "../utils/middlewares/authorisation.js";

const router = express.Router();
// Public routes
router.post("/register", register);
router.post("/login", login);
// New Route to verify email
router.get("/verify-email/:token", verifyEmail);

// Reset password routes (public)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Private Routes that need a token access
router.get("/me", protect, getMe);

export default router;
