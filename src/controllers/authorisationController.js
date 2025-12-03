import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
// function for generating a token

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
}

/**
 * @desc    Inscription (Register)
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function register(req, res) {
  try {
    const { nom, email, password } = req.body;

    // Verify if the user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    // Create a user
    const user = await User.create({
      nom,
      email,
      password, // Hashed password automatically by middleware pre('save')
    });

    // Generate a token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
}

/**
 * @desc    Connexion (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    // Found User with password this time.
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Veryfy password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
}

/**
 * @desc    get the profil
 * @route   GET /api/auth/me
 * @access  Private (protected)
 */
export async function getMe(req, res) {
  try {
    // req.user is defined by the middleware protect
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
  }
}
