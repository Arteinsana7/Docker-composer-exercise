
import UserModel from "../models/UserModel.js";
import Article from "../models/Article.js";
import Comment from "../models/Comment.js"
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
}
);

/*
* @desc Delete account
* @route Delete/api/users/me
* @access private access
*/

export async function deleteAccount(req, res) {
  try {
    // Delete user's data
    await Comment.deleteMany({ author: req.user._id });
    await Article.deleteMany({ author: req.user._id });
    await UserModel.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message
    });
  }
}

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
