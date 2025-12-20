import express from 'express';
import { updateProfile, changePassword } from '../controllers/UserController.js';
import { protect } from '../utils/middlewares/authMiddleware.js';

const router = express.Router();

router.put('/me', protect, updateProfile);
router.put('/me/password', protect, changePassword);

export default router;
