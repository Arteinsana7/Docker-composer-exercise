import express from "express";
import {
  register,
  login,
  getMe,
  verifyEmail,
} from "../controllers/authorisationController.js";
import { protect } from "../utils/middlewares/authorisation.js";

const router = express.Router();
// Public routes
router.post("/register", register);
router.post("/login", login);
// New Route to verify email
router.get("/verify-email/:token", verifyEmail);

// Private Routes that need an access token
router.get("/me", protect, getMe);

export default router;
