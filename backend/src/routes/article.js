import express from "express";

import {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticleWithComments,
  updateArticle,
  getPublishedArticles,
  deleteArticle,
  togglePublishArticle,
} from "../controllers/ArticleController.js";
import { getCommentsByArticle } from "../controllers/CommentController.js";
import { protect } from "../utils/middlewares/authorisation.js";
const router = express.Router();

// === FIRST THE SPECIFIQUE ROUTES ===
// publish articles
router.get("/published", getPublishedArticles);
// add protected middleware the protected routes = creation , modification and delete.

// === GENERAL ROUTES ===
router.get("/", getAllArticles);
router.post("/", protect, createArticle); // PROTECTED ROUTE WITH THE AUTHORISATION MIDDLEWARE

// === ROUTES WITH ID ===
router.get("/:id", getArticleById);
router.get("/:id/with-comments", getArticleWithComments);
router.get("/:id/comments", getCommentsByArticle);
router.put("/:id", protect, updateArticle); // PROTECTED ROUTE WITH THE AUTHORISATION MIDDLEWARE
router.delete("/:id", protect, deleteArticle); // PROTECTED ROUTE WITH THE AUTHORISATION MIDDLEWARE
router.patch("/:id/publish", protect, togglePublishArticle); // PROTECTED ROUTE WITH THE AUTHORISATION MIDDLEWARE

export default router;
