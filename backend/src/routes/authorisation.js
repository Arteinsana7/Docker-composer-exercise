import express from "express";
import {
  register,
  login,
  getMe,
} from "../controllers/authorisationController.js";
import { protect } from "../utils/middlewares/authorisation.js";

const router = express.Router();
// Public routes
router.post("/register", register);
router.post("/login", login);

// Private Routes that need an access token
router.get("/me", protect, getMe);

export default router;
