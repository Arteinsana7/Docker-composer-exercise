import express from "express";
import {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByArticle, // from article controller
  updateComment,
  deleteComment,
  likeComment,
} from "../controllers/CommentController.js";
import { protect } from "../utils/middlewares/authorisation.js";

const router = express.Router();

// ===== ROUTES PUBLIQUES =====

// GET /api/comments - all comments
router.get("/", getAllComments);

// GET /api/comments/:id - commentaire by ID
router.get("/:id", getCommentById);

// ===== ROUTES PROTÉGÉES =====

// POST /api/comments/:articleId - create a comment
router.post("/:articleId", protect, createComment);

// PUT /api/comments/:id - Modify a comment
router.put("/:id", protect, updateComment);

// DELETE /api/comments/:id - delete a comment
router.delete("/:id", protect, deleteComment);

// PATCH /api/comments/:id/like - Like a comment
router.patch("/:id/like", likeComment);

export default router;
