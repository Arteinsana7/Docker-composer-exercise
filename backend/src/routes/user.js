import express from 'express';
import { updateProfile, deleteAccount, changePassword } from '../controllers/userController.js';
import { protect } from "../utils/middlewares/authorisation.js";

const router = express.Router();

router.put('/me', protect, updateProfile);
router.put('/me/password', protect, changePassword);
router.delete('/me', protect, deleteAccount)

export default router;
