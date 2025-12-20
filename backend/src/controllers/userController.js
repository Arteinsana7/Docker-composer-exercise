// backend/src/controllers/UserController.js
import UserModel from "../models/UserModel.js";
import { catchAsync } from "../utils/middlewares/errorHandler.js";
import AppError from "../utils/AppError.js";

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

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await UserModel.findById(req.user._id).select('+password');

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
