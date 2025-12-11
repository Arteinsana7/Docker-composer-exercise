import Comment from "../models/Comment.js";
import Article from "../models/Article.js";
import { catchAsync } from "../utils/middlewares/errorHandler.js";
import AppError from "../utils/AppError.js";

/**
 * @desc    Créer un commentaire
 * @route   POST /api/comments/:articleId
 * @access  Private
 */
export const createComment = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  const { articleId } = req.params;

  // Vérifier que l'article existe
  const articleExists = await Article.findById(articleId);
  if (!articleExists) {
    return next(new AppError("Article non trouvé", 404));
  }

  // Créer le commentaire (auteur = user connecté)
  const comment = await Comment.create({
    content,
    author: req.user._id,
    article: articleId,
  });

  res.status(201).json({
    success: true,
    message: "Commentaire créé avec succès",
    data: comment,
  });
});

/**
 * @desc    Récupérer tous les commentaires
 * @route   GET /api/comments
 * @access  Public
 */
export const getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find()
    .populate("author", "nom email")
    .populate("article", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

/**
 * @desc    Récupérer un commentaire par ID
 * @route   GET /api/comments/:id
 * @access  Public
 */
export const getCommentById = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id)
    .populate("author", "nom email")
    .populate("article", "title author");

  if (!comment) {
    return next(new AppError("Commentaire non trouvé", 404));
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});

/**
 * @desc    Récupérer les commentaires d'un article
 * @route   GET /api/articles/:articleId/comments
 * @access  Public
 */
export const getCommentsByArticle = catchAsync(async (req, res, next) => {
  const { articleId } = req.params;

  // Vérifier que l'article existe
  const articleExists = await Article.findById(articleId);
  if (!articleExists) {
    return next(new AppError("Article non trouvé", 404));
  }

  // Récupérer les commentaires
  const comments = await Comment.find({ article: articleId })
    .populate("author", "nom email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

/**
 * @desc    Mettre à jour un commentaire
 * @route   PUT /api/comments/:id
 * @access  Private (author only)
 */
export const updateComment = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError("Commentaire non trouvé", 404));
  }

  // Vérifier que l'utilisateur connecté est l'auteur
  if (comment.author.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        "Non autorisé : vous n'êtes pas l'auteur de ce commentaire",
        403
      )
    );
  }

  // Modifier le contenu
  comment.content = content;
  await comment.save();

  res.status(200).json({
    success: true,
    message: "Commentaire mis à jour avec succès",
    data: comment,
  });
});

/**
 * @desc    Supprimer un commentaire
 * @route   DELETE /api/comments/:id
 * @access  Private (author only)
 */
export const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError("Commentaire non trouvé", 404));
  }

  // Vérifier que l'utilisateur connecté est l'auteur
  if (comment.author.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        "Non autorisé : vous n'êtes pas l'auteur de ce commentaire",
        403
      )
    );
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Commentaire supprimé avec succès",
    data: comment,
  });
});

/**
 * @desc    Liker un commentaire
 * @route   PATCH /api/comments/:id/like
 * @access  Public (pour l'instant, sans tracking)
 */
export const likeComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError("Commentaire non trouvé", 404));
  }

  // Utiliser la méthode du model (si elle existe)
  // Pour l'instant, juste incrémenter likes manuellement
  comment.likes = (comment.likes || 0) + 1;
  await comment.save();

  res.status(200).json({
    success: true,
    message: "Commentaire liké avec succès",
    data: comment,
  });
});
