import express from "express";

import {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticleWithComments,
  updateArticle,
  getPublishedArticles,
  getArticlesByCategory,
  getMyArticles,
  deleteArticle,
  togglePublishArticle,
} from "../controllers/ArticleController.js";
import { getCommentsByArticle } from "../controllers/CommentController.js";
import { protect } from "../utils/middlewares/authorisation.js";
import { isAdmin } from "../utils/middlewares/admin.js";

const router = express.Router();

// === FIRST THE SPECIFIQUE ROUTES ===
router.get("/published", getPublishedArticles);
router.get("/category/:category", getArticlesByCategory);
router.get('/my-articles', protect, getMyArticles);  //  AVANT /:id

// === GENERAL ROUTES ===
router.get("/", getAllArticles);
router.post("/", protect, isAdmin, createArticle);

// === ROUTES WITH ID (amin acces only added admin middleware) ===
router.get("/:id", getArticleById);
router.get("/:id/with-comments", getArticleWithComments);
router.get("/:articleId/comments", getCommentsByArticle);
router.put("/:id", protect, isAdmin, updateArticle);
router.delete("/:id", protect, isAdmin, deleteArticle);
router.patch("/:id/publish", protect, isAdmin, togglePublishArticle);

export default router;
