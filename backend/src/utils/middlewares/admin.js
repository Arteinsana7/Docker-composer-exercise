export const isAdmin = (req, res, next) => {
  // req.user est déjà défini par le middleware "protect"
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }

  next();
};
