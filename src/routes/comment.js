// src/routes/comment.js

import express from "express";
import {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  likeComment,
} from "../controllers/CommentController.js";

const router = express.Router();

// =====  GENERAL ROUTES  =====

// GET /api/comments - ALL COMMENTS
router.get("/", getAllComments);

// POST /api/comments - CREATE A NEW COMMENT
router.post("/", createComment);

// ===== ROUTES WITH ID =====

// GET /api/comments/:id - JUST ONE COMMENT
router.get("/:id", getCommentById);

// PUT /api/comments/:id - MODIFY A COMMENT
router.put("/:id", updateComment);

// DELETE /api/comments/:id - DELETE A COMMENT
router.delete("/:id", deleteComment);

// // PATCH /api/comments/:id/like - LIKE A COMMENT (MAYBE TO IMPLEMATE LATER)
// router.patch("/:id/like", likeComment);

export default router;
