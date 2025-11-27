import express from "express";

import {
  createArticle,
  getAllArticles,
  getArticleById,
  getArticleWithComments,
  updateArticle,
  getPublishedArticles,
  deleteArticle,
} from "../controllers/ArticleController.js";
import { getCommentsByArticle } from "../controllers/CommentController.js";

const router = express.Router();

// === FIRST THE SPECIFIQUE ROUTES ===
// publish articles
router.get("/published", getPublishedArticles);
// general routes
router.get("/", getAllArticles);
router.post("/", createArticle);

// Routes with Id
router.get("/:id", getArticleById);
router.get("/:id/with-comments", getArticleWithComments);
router.get("/:id/comments", getCommentsByArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
