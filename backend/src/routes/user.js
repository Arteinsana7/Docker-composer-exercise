import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from "../utils/middlewares/authorisation.js";

const router = express.Router();

router.put('/me', protect, updateProfile);
router.put('/me/password', protect, changePassword);

export default router;
