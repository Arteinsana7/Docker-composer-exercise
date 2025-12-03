import jwt from "jsonwebtoken";
import UserModel from "../../models/UserModel.js"; // ← Ajoute aussi le bon chemin
// middleware for protecting the routes
export async function protect(req, res, next) {
  try {
    let token;
    // verify if tyhe token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // if they is not token
    if (!token) {
      return res.status(401).json({ success: false, message: "Non autorisé" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id).select("-password"); // ← UserModel
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token invalide" });
  }
}
