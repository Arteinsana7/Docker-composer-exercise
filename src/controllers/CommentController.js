// src/controllers/CommentController.js

import Comment from "../models/Comment.js";
import Article from "../models/Article.js";

/**
 * @desc    Créer un commentaire
 * @route   POST /api/comments
 * @access  Public
 */
export async function createComment(req, res) {
  try {
    const { content, author, article } = req.body;

    // Vérifier que l'article existe
    const articleExists = await Article.findById(article);
    if (!articleExists) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    // Créer le commentaire
    const comment = await Comment.create({
      content,
      author,
      article,
    });

    res.status(201).json({
      success: true,
      message: "Commentaire créé avec succès",
      data: comment,
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
      message: "Erreur lors de la création du commentaire",
      error: error.message,
    });
  }
}

/**
 * @desc    Récupérer tous les commentaires
 * @route   GET /api/comments
 * @access  Public
 */
export async function getAllComments(req, res) {
  try {
    const comments = await Comment.find()
      .populate("article", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commentaires",
      error: error.message,
    });
  }
}

/**
 * @desc    Récupérer un commentaire par ID
 * @route   GET /api/comments/:id
 * @access  Public
 */
export async function getCommentById(req, res) {
  try {
    const comment = await Comment.findById(req.params.id).populate(
      "article",
      "title author"
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "ID du commentaire non valide",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du commentaire",
      error: error.message,
    });
  }
}

/**
 * @desc    Récupérer les commentaires d'un article
 * @route   GET /api/articles/:articleId/comments
 * @access  Public
 */
export async function getCommentsByArticle(req, res) {
  try {
    const { articleId } = req.params;

    // Vérifier que l'article existe
    const articleExists = await Article.findById(articleId);
    if (!articleExists) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    // Récupérer les commentaires
    const comments = await Comment.find({ article: articleId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commentaires",
      error: error.message,
    });
  }
}

/**
 * @desc    Mettre à jour un commentaire
 * @route   PUT /api/comments/:id
 * @access  Public
 */
export async function updateComment(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Commentaire mis à jour avec succès",
      data: comment,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "ID du commentaire non valide",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du commentaire",
      error: error.message,
    });
  }
}

/**
 * @desc    Supprimer un commentaire
 * @route   DELETE /api/comments/:id
 * @access  Public
 */
export async function deleteComment(req, res) {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Commentaire supprimé avec succès",
      data: comment,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "ID du commentaire non valide",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du commentaire",
      error: error.message,
    });
  }
}

/**
 * @desc    Liker un commentaire
 * @route   PATCH /api/comments/:id/like
 * @access  Public
 */
export async function likeComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    // Utiliser la méthode du model
    await comment.liker();

    res.status(200).json({
      success: true,
      message: "Commentaire liké avec succès",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du like",
      error: error.message,
    });
  }
}
