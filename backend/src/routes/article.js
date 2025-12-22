import express from "express";

import {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticleWithComments,
  updateArticle,
  getPublishedArticles,
  getArticlesByCategory,
  getMyArticles,  // ← Un seul import ici
  deleteArticle,
  togglePublishArticle,
} from "../controllers/ArticleController.js";
import { getCommentsByArticle } from "../controllers/CommentController.js";
import { protect } from "../utils/middlewares/authorisation.js";

const router = express.Router();

// === FIRST THE SPECIFIQUE ROUTES ===
router.get("/published", getPublishedArticles);
router.get("/category/:category", getArticlesByCategory);
router.get('/my-articles', protect, getMyArticles);  // ← AVANT /:id

// === GENERAL ROUTES ===
router.get("/", getAllArticles);
router.post("/", protect, createArticle);

// === ROUTES WITH ID ===
router.get("/:id", getArticleById);
router.get("/:id/with-comments", getArticleWithComments);
router.get("/:articleId/comments", getCommentsByArticle);
router.put("/:id", protect, updateArticle);
router.delete("/:id", protect, deleteArticle);
router.patch("/:id/publish", protect, togglePublishArticle);

export default router;
